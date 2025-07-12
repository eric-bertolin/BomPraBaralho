import React, { useState, useMemo, useEffect } from 'react';

const CORES = ['Branco', 'Azul', 'Preto', 'Vermelho', 'Verde'];
const TIPOS = ['Criatura', 'Feitiço', 'Artefato', 'Encantamento', 'Terreno', 'Planeswalker', 'Instantâneo'];

function CriarDeckPage() {
  const [colecao, setColecao] = useState([]);
  const [filtroTipos, setFiltroTipos] = useState([]);
  const [filtroCores, setFiltroCores] = useState([]);
  const [busca, setBusca] = useState('');
  const [deck, setDeck] = useState({});
  const [nomeDeck, setNomeDeck] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/cartas')
      .then(res => res.json())
      .then(data => setColecao(data))
      .catch(err => console.error('Erro ao buscar coleção:', err));
  }, []);

  const toggleTipo = (tipo) => {
    setFiltroTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const toggleCor = (cor) => {
    setFiltroCores((prev) =>
      prev.includes(cor) ? prev.filter((c) => c !== cor) : [...prev, cor]
    );
  };

  const adicionarCarta = (carta) => {
    const quantidadeAtual = deck[carta.nome]?.quantidade || 0;
    if (quantidadeAtual < 4) {
      setDeck((prev) => ({
        ...prev,
        [carta.nome]: {
          ...carta,
          quantidade: quantidadeAtual + 1,
        },
      }));
    }
  };

  const removerCarta = (nome) => {
    setDeck((prev) => {
      const novo = { ...prev };
      if (novo[nome].quantidade > 1) {
        novo[nome].quantidade -= 1;
      } else {
        delete novo[nome];
      }
      return novo;
    });
  };

  const cartasFiltradas = useMemo(() => {
    return colecao.filter((carta) => {
      const nomeMatch = carta.nome?.toLowerCase().includes(busca.toLowerCase());
      const tipoMatch = filtroTipos.length === 0 || filtroTipos.includes(carta.tipo);
      const corMatch = filtroCores.length === 0 || filtroCores.includes(carta.cor);
      return nomeMatch && tipoMatch && corMatch;
    });
  }, [colecao, busca, filtroTipos, filtroCores]);

  const totalCartas = Object.values(deck).reduce((acc, c) => acc + c.quantidade, 0);

  const salvarDeck = () => {
    if (!nomeDeck || totalCartas < 60) return;
    const novoDeck = {
      id: Date.now(), // ID simples com timestamp
      nome: nomeDeck,
      cartas: deck,
      criadoEm: new Date().toISOString(),
    };

    fetch('http://localhost:3001/api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoDeck),
    })
      .then(() => {
        setDeck({});
        setNomeDeck('');
        alert('Deck salvo com sucesso!');
      })
      .catch((err) => console.error('Erro ao salvar deck:', err));
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4">Criar Deck</h2>

      <div className="row mt-4">
        <div className="col-md-6">
          <h5>Filtro por Nome</h5>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar carta pelo nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <h5 className="mt-3">Filtro por Tipo</h5>
          <div className="d-flex flex-wrap gap-2">
            {TIPOS.map((tipo) => (
              <button
                key={tipo}
                className={`btn ${filtroTipos.includes(tipo) ? 'btn-secondary' : 'btn-outline-secondary'}`}
                onClick={() => toggleTipo(tipo)}
              >
                {tipo}
              </button>
            ))}
          </div>

          <h5 className="mt-3">Filtro por Cor</h5>
          <div className="d-flex flex-wrap gap-2">
            {CORES.map((cor) => (
              <button
                key={cor}
                className={`btn ${filtroCores.includes(cor) ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => toggleCor(cor)}
              >
                {cor}
              </button>
            ))}
          </div>

          <h5 className="mt-4">Sua Coleção ({cartasFiltradas.length} cartas encontradas)</h5>
          <div className="slider-container">
            {cartasFiltradas.map((carta, index) => (
              <img
                key={index}
                src={carta.imagem}
                alt={carta.nome}
                className="cardimg"
                onClick={() => adicionarCarta(carta)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <h5>Deck Montado ({totalCartas} cartas)</h5>
          {totalCartas < 60 && (
            <p className="text-danger">Deck incompleto: mínimo de 60 cartas.</p>
          )}
          <ul className="list-group">
            {Object.values(deck).map((carta, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {carta.nome} ({carta.tipo})
                <span>
                  x{carta.quantidade}
                  <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => removerCarta(carta.nome)}>
                    -
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Nome do deck"
              value={nomeDeck}
              onChange={(e) => setNomeDeck(e.target.value)}
            />
            <button
              className="btn btn-success"
              disabled={totalCartas < 60 || !nomeDeck}
              onClick={salvarDeck}
            >
              Salvar Deck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CriarDeckPage;

import React, { useEffect, useState } from 'react';

const ComunidadePage = ({ setCurrentPage, setDeckSelecionado }) => {
  const [novos, setNovos] = useState([]);
  const [melhores, setMelhores] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/decksNovos')
      .then((res) => res.json())
      .then((todos) => {
        const agora = new Date();
        const mesatras = new Date();
        mesatras.setDate(agora.getDate() - 7);

        const recentes = todos.filter(deck =>
          deck.publicadoEm ? new Date(deck.publicadoEm) >= mesatras : true
        );

        // Exibe só os 5 melhores decks avaliados
        const bemAvaliados = todos
          .filter(deck => (deck.avaliacao || 0) > 0)
          .sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0))
          .slice(0, 5);

        setNovos(recentes);
        setMelhores(bemAvaliados);
      })
      .catch(err => console.error('Erro ao carregar decks da comunidade:', err));

    // Buscar decks favoritos da nova rota
    fetch('http://localhost:3001/api/decksFavoritos')
      .then((res) => res.json())
      .then((decks) => {
        // Ordena por saldo e pega os 5 melhores
        const top5 = [...decks].sort((a, b) => (b.saldo || 0) - (a.saldo || 0)).slice(0, 5);
        setFavoritos(top5);
      })
      .catch((err) => console.error('Erro ao carregar decks favoritos:', err));
  }, []);

  return (
    <>
      <h1>DECKS NOVOS</h1>
      <div className="slider-container mt-3 mb-5">
        {novos.length === 0 ? (
          <p className="text-muted">Ainda não há decks novos.</p>
        ) : (
          novos.map((deck, i) => (
            <div
              key={i}
              className="text-center"
              style={{ minWidth: '200px', cursor: 'pointer' }}
              onClick={() => {
                setDeckSelecionado(deck);
                setCurrentPage('visualizar-deck');
              }}
            >
              <img
                className="cardimg rounded img-fluid mb-2"
                src={
                  deck.cor
                    ? `/IMGS/CAPADEBARALHO/${deck.cor.toUpperCase()}.PNG`
                    : deck.imagem || '/IMGS/CAPADEBARALHO/BRANCO.PNG'
                }
                alt={deck.nome}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '/IMGS/CAPADEBARALHO/BRANCO.PNG';
                }}
              />
              <h6>{deck.nome}</h6>
            </div>
          ))
        )}
      </div>

      <h1 className="mt-5">DECKS FAVORITOS DE TODOS OS TEMPOS</h1>
      <div className="slider-container mt-3 mb-5">
        {favoritos.length === 0 ? (
          <p className="text-muted">Ainda não há decks favoritos cadastrados.</p>
        ) : (
          favoritos.map((deck, i) => (
            <div
              key={i}
              className="text-center"
              style={{ minWidth: '200px', cursor: 'pointer' }}
              onClick={() => {
                setDeckSelecionado(deck);
                setCurrentPage('visualizar-deck');
              }}
            >
              <img
                className="cardimg rounded img-fluid mb-2"
                src={deck.cor
                  ? `/IMGS/CAPADEBARALHO/${deck.cor.toUpperCase()}.PNG`
                  : deck.imagem || '/IMGS/CAPADEBARALHO/BRANCO.PNG'}
                alt={deck.nome}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '/IMGS/CAPADEBARALHO/BRANCO.PNG';
                }}
              />
              <h6>{deck.nome}</h6>
            </div>
          ))
        )}
      </div>

    </>
  );
};

export default ComunidadePage;

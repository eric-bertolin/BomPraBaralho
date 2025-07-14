import React, { useEffect, useState, useRef } from 'react';

const MeusDecksPage = ({ setCurrentPage, setDeckSelecionado }) => {
  const [decks, setDecks] = useState([]);
  const [acessoNegado, setAcessoNegado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAcessoNegado(true);
      return;
    }

    fetch('http://localhost:3001/api/decks', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            setAcessoNegado(true);
          }
          throw new Error('Erro de autenticação');
        }
        return res.json();
      })
      .then((data) => setDecks(data))
      .catch((err) => {
        console.error('Erro ao buscar decks:', err);
        setDecks([]);
      });
  }, []);

  if (acessoNegado) {
    return (
      <div className="container text-center my-5">
        <h3 className="text-danger">Faça log in para ver a página</h3>
        <button className="btn btn-secondary mt-3" onClick={() => setCurrentPage('menu')}>
          Voltar ao menu
        </button>
      </div>
    );
  }

  const removerDeck = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja remover este deck?');
    if (!confirmar) return;

    try {
      await fetch(`http://localhost:3001/api/decks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      setDecks((prev) => prev.filter((deck) => deck.id !== id));
    } catch (err) {
      console.error('Erro ao remover deck:', err);
      alert('Erro ao remover. Veja o console.');
    }
  };

  const publicarDeck = async (deck) => {
    try {
      const publicadosRes = await fetch('http://localhost:3001/api/decksNovos');
      const publicados = await publicadosRes.json();

      const jaPublicado = publicados.some((d) => d.id === deck.id);
      if (jaPublicado) {
        alert('Esse deck já foi publicado.');
        return;
      }

      let imagem;
      const cartasArray = Object.values(deck.cartas || {});
      switch (cartasArray[0]?.cor) {
        case 'Preto': imagem = "public/IMGS/CAPADEBARALHO/PRETO.PNG"; break;
        case 'Branco': imagem = "public/IMGS/CAPADEBARALHO/BRANCO.PNG"; break;
        case 'Verde': imagem = "public/IMGS/CAPADEBARALHO/VERDE.PNG"; break;
        case 'Azul': imagem = "public/IMGS/CAPADEBARALHO/AZUL.PNG"; break;
        case 'Vermelho': imagem = "public/IMGS/CAPADEBARALHO/VERMELHO.PNG"; break;
        default: imagem = "public/IMGS/CAPADEBARALHO/GENERICA.PNG"; break;
      }

      const novoDeck = {
        id: deck.id,
        nome: deck.nome,
        imagem,
        cartas: cartasArray,
        publicadoEm: new Date().toISOString(),
        avaliacao: 0
      };

      await fetch('http://localhost:3001/api/decksNovos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(novoDeck),
      });

      alert(`Deck "${deck.nome}" publicado com sucesso!`);
    } catch (err) {
      console.error('Erro ao publicar deck:', err);
      alert('Erro ao publicar o deck. Veja o console.');
    }
  };

  return (
    <div className="container my-4 text-center">
      <h2>Meus Decks</h2>

      {decks.length === 0 ? (
        <div className="mt-4">
          <p className="text-muted">Você ainda não criou nenhum deck.</p>
          <button
            className="btn btn-primary"
            onClick={() => setCurrentPage('criar-deck')}
          >
            Criar novo Deck
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="card shadow-sm"
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <h5
                  className="card-title"
                  onClick={() => {
                    setDeckSelecionado(deck);
                    setCurrentPage('visualizar-deck');
                  }}
                >
                  {deck.nome}
                </h5>
                <p className="card-text">{Object.keys(deck.cartas).length} cartas</p>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  Criado em: {new Date(deck.criadoEm).toLocaleDateString()}
                </p>
                <button
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    removerDeck(deck.id);
                  }}
                >
                  Remover
                </button>
                <button
                  className="btn btn-sm mt-2"
                  onClick={() => publicarDeck(deck)}
                >
                  Publicar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeusDecksPage;

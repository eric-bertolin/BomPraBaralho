import React, { useEffect, useState } from 'react';

const MenuPage = ({ setDeckSelecionado, setCurrentPage }) => {
  const [novidades, setNovidades] = useState([]);
  const [decksSemana, setDecksSemana] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    
    fetch('http://localhost:3001/api/novidades')
      .then((res) => res.json())
      .then(setNovidades)
      .catch((err) => console.error('Erro ao carregar novidades:', err));

    
    fetch('http://localhost:3001/api/decksNovos')
      .then((res) => res.json())
      .then((decks) => {
        const agora = new Date();
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(agora.getDate() - 7);

        // Decks da semana
        const semana = decks.filter(deck =>
          new Date(deck.publicadoEm) >= seteDiasAtras
        );
        setDecksSemana(semana);
      })
      .catch((err) => console.error('Erro ao carregar decks da comunidade:', err));

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
      <div className="slider-destaque">
        {novidades.map((item, i) => (
          <img
            key={i}
            src={item.imagem}
            alt={item.nome}
            className="cardimg"
            style={{ cursor: 'pointer' }}
            onClick={() => window.open(item.link, '_blank')}
          />
        ))}
      </div>

      <h1 className="mt-5">DECKS QUENTES DA SEMANA</h1>
      <div className="slider-destaque mt-3 mb-5">
        {decksSemana.length === 0 ? (
          <p className="text-muted">Ainda não há decks desta semana.</p>
        ) : (
          decksSemana.map((deck, i) => (
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
      <div className="slider-destaque mt-3">
        {favoritos.length === 0 ? (
          <p className="text-muted">Ainda não há decks favoritos cadastrados.</p>
        ) : (
          favoritos.map((deck, i) => (
            <img
              key={i}
              src={deck.cor
                ? `/IMGS/CAPADEBARALHO/${deck.cor.toUpperCase()}.PNG`
                : deck.imagem || '/IMGS/CAPADEBARALHO/BRANCO.PNG'}
              alt={deck.nome}
              className="cardimg rounded img-fluid mb-2"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setDeckSelecionado(deck);
                setCurrentPage('visualizar-deck');
              }}
              onError={e => {
                e.target.onerror = null;
                e.target.src = '/IMGS/CAPADEBARALHO/BRANCO.PNG';
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default MenuPage;

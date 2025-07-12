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

        
        const semana = decks.filter(deck =>
          new Date(deck.publicadoEm) >= seteDiasAtras
        );

        
        const avaliados = decks
          .filter(deck => (deck.avaliacao || 0) > 0)
          .sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0));

        setDecksSemana(semana);
        setFavoritos(avaliados);
      })
      .catch((err) => console.error('Erro ao carregar decks da comunidade:', err));
  }, []);

  return (
    <>
      <h1 className="mt-4 text-center">NOVIDADES EM MTG</h1>
      <div className="slider-destaque">
        {novidades.map((item, i) => (
          <img
              key={i}
              src={item.imagem}
              alt={item.nome}
              className="cardimg"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.open(item.link, '_blank');
                 
    }}
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
                src={deck.imagem}
                alt={deck.nome}
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
              src={deck.imagem}
              alt={deck.nome}
              className="text-center"
              onClick={() => {
                setDeckSelecionado(deck);
                setCurrentPage('visualizar-deck');
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default MenuPage;

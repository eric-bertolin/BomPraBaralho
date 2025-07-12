import React, { useEffect, useState } from 'react';

const ComunidadePage = ({ setCurrentPage, setDeckSelecionado }) => {
  const [novos, setNovos] = useState([]);
  const [melhores, setMelhores] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/decksNovos')
      .then((res) => res.json())
      .then((todos) => {
        const agora = new Date();
        const mesatras = new Date();
        mesatras.setDate(agora.getDate() - 7);

        
        const recentes = todos.filter(deck =>
          new Date(deck.publicadoEm) >= mesatras
        );

        
        const bemAvaliados = todos
          .filter(deck => (deck.avaliacao || 0) > 0)
          .sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0));

        setNovos(recentes);
        setMelhores(bemAvaliados);
      })
      .catch(err => console.error('Erro ao carregar decks da comunidade:', err));
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
                src={deck.imagem}
                alt={deck.nome}
              />
              <h6>{deck.nome}</h6>
            </div>
          ))
        )}
      </div>

      <h1 className="mt-5">DECKS MAIS BEM AVALIADOS</h1>
      <div className="slider-container mt-3 mb-5">
        {melhores.length === 0 ? (
          <p className="text-muted">Ainda não há decks nessa categoria.</p>
        ) : (
          melhores.map((deck, i) => (
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
    </>
  );
};

export default ComunidadePage;

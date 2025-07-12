
import React, { useEffect, useState } from 'react';
import Carta from '../components/Carta';

function ColecaoPage({ setCurrentPage }) {
  const [colecao, setColecao] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/colecao')
      .then((res) => res.json())
      .then(setColecao)
      .catch((err) => console.error('Erro ao carregar coleção:', err));
  }, []);

  const removerCarta = (id) => {
    fetch(`http://localhost:3001/api/colecao/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setColecao((prev) => prev.filter((c) => c.id !== id));
      })
      .catch((err) => console.error('Erro ao remover carta:', err));
  };

  return (
    <div className="container text-center my-4">
      {colecao.length === 0 ? (
        <div>
          <h3 className="mb-4">VOCÊ AINDA NÃO TEM CARTAS</h3>
          <p>ADICIONE AQUI:</p>
          <button className="btn btn-primary mt-2" onClick={() => setCurrentPage('pesquisar')}>
            Ir para Pesquisa de Cartas
          </button>
        </div>
      ) : (
        <div className="slider-container">
          {colecao.map((carta) => (
            <Carta
              key={carta.id}
              id={carta.id}
              imagem={carta.imagem}
              nome={carta.nome}
              cor={carta.cor}
              tipo={carta.tipo}
              onRemove={removerCarta}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ColecaoPage;

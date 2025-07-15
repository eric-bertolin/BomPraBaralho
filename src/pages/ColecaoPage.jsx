import React, { useEffect, useState } from 'react';
import Carta from '../components/Carta';

function ColecaoPage({ setCurrentPage }) {
  const [colecao, setColecao] = useState([]);

  const carregarColecao = () => {
    fetch('http://localhost:3001/api/colecao', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then(setColecao)
      .catch((err) => console.error('Erro ao carregar coleção:', err));
  };

  useEffect(() => {
    carregarColecao();
  }, []);

  const removerCarta = (mongoId) => {
    fetch(`http://localhost:3001/api/colecao/${mongoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then(() => {
        setColecao((prev) => prev.filter((c) => c._id !== mongoId));
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
              key={carta._id}
              id={carta._id}
              imagem={carta.imagem}
              nome={carta.nome}
              cor={carta.cor}
              tipo={carta.tipo}
              onRemove={removerCarta}
              onAdicionada={carregarColecao}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ColecaoPage;

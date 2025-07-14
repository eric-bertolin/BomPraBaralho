import React, { useEffect, useState } from 'react';
import Carta from '../components/Carta';

function ColecaoPage({ setCurrentPage }) {
  const [colecao, setColecao] = useState([]);
  const [acessoNegado, setAcessoNegado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAcessoNegado(true);
      return;
    }

    fetch('http://localhost:3001/api/colecao', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            setAcessoNegado(true);
          }
          throw new Error('Erro de autenticação');
        }
        return res.json();
      })
      .then(setColecao)
      .catch((err) => {
        console.error('Erro ao carregar coleção:', err);
        setColecao([]);
      });
  }, []);

  const removerCarta = (id) => {
    fetch(`http://localhost:3001/api/colecao/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(() => {
        setColecao((prev) => prev.filter((c) => c.id !== id));
      })
      .catch((err) => console.error('Erro ao remover carta:', err));
  };

  // 🚫 Bloquear renderização caso o acesso tenha sido negado
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

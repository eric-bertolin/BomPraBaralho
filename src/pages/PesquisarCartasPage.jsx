
import React, { useEffect, useState } from 'react';
import Carta from '../components/Carta';

function PesquisarCartasPage() {
  const [cartas, setCartas] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/cartas')
      .then((res) => res.json())
      .then(setCartas)
      .catch((err) => console.error('Erro ao buscar cartas:', err));
  }, []);

  const adicionarAColecao = (carta) => {
    const novaCarta = { ...carta };
    delete novaCarta.id;

    fetch('http://localhost:3001/api/colecao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaCarta),
    })
      .then(() => alert('Carta adicionada à coleção!'))
      .catch((err) => console.error('Erro ao adicionar carta:', err));
  };

  const cartasFiltradas = cartas.filter((carta) =>
    carta.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container text-center">
      <h3 className="my-4">Pesquisar Cartas</h3>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Buscar por nome da carta..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="slider-container">
        {cartasFiltradas.map((carta) => (
          <Carta
            key={carta.id}
            id={carta.id}
            imagem={carta.imagem}
            nome={carta.nome}
            cor={carta.cor}
            tipo={carta.tipo}
            onAdd={() => adicionarAColecao(carta)}
          />
        ))}
      </div>
    </div>
  );
}

export default PesquisarCartasPage;

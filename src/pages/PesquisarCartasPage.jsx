
import React, { useEffect, useState } from 'react';
import Carta from '../components/Carta';

function PesquisarCartasPage() {
  const [cartas, setCartas] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
  fetch('http://localhost:3001/api/cartas')
    .then((res) => {
      if (!res.ok) {
        throw new Error('Resposta inválida da API');
      }
      return res.json();
    })
    .then(setCartas)
    .catch((err) => console.error('Erro ao buscar cartas:', err));
}, []);

  function adicionarAColecao(carta) {
  fetch('http://localhost:3001/api/colecao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: carta.nome,
      imagem: carta.imagem,
      cor: carta.cor,
      tipo: carta.tipo
    })
  })
    .then((res) => {
      if (!res.ok) throw new Error('Erro ao adicionar');
      return res.json();
    })
    .then(() => alert('Carta adicionada à coleção!'))
    .catch((err) => console.error('❌ Erro ao adicionar:', err));
}


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

import React, { useEffect, useState } from 'react';

function VisualizarDeckPage({ deck, setCurrentPage, setDeckSelecionado }) {
  const [salvo, setSalvo] = useState(false);
  const [votoAtual, setVotoAtual] = useState(null); 

  useEffect(() => {
    if (!deck) return;

    
    fetch('http://localhost:3001/api/decks')
      .then((res) => res.json())
      .then((decks) => {
        const jaSalvo = decks.some((d) => d.nome === deck.nome);
        setSalvo(jaSalvo);
      });

  
    const votos = JSON.parse(localStorage.getItem('votos') || '{}');
    setVotoAtual(votos[deck.id] || null);
  }, [deck]);

  const salvarDeck = async () => {
    const novoDeck = {
      nome: deck.nome,
      imagem: deck.imagem || '/IMGS/placeholder.jpg',
      cartas: deck.cartas,
      criadoEm: new Date().toISOString()
    };
    try {
      await fetch('http://localhost:3001/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoDeck)
      });

      setSalvo(true);
      alert('Deck salvo com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar deck:', err);
      alert('Erro ao salvar o deck. Veja o console.');
    }
  };

const [voto, setVoto] = useState(null);

const handleVoto = async (tipo) => {
  if (voto === tipo) return;

  const isLike = tipo === 'like';
  const ajuste = voto === null ? 1 : 2; 
  const novaAvaliacao = (deck.avaliacao || 0) + (isLike ? ajuste : -ajuste);

  await fetch(`http://localhost:3001/api/decksNovos/${deck.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ avaliacao: novaAvaliacao })
  });

  setVoto(tipo);
  setDeckSelecionado({ ...deck, avaliacao: novaAvaliacao });
};
  if (!deck) {
    return (
      <div className="container text-center my-5">
        <h3>Deck não encontrado.</h3>
        <button className="btn btn-secondary mt-3" onClick={() => setCurrentPage('menu')}>
          Ir para Menu
        </button>
      </div>
    );
  }

  const navegar = (pagina) => {
    setDeckSelecionado(null);
    setCurrentPage(pagina);
  };

  return (
    <div className="container text-center my-4">
      <h2>{deck.nome}</h2>
      <p className="text-muted">
        Total de cartas: {Object.values(deck.cartas).reduce((s, c) => s + c.quantidade, 0)}
      </p>

      <div className="row justify-content-center">
        {Object.values(deck.cartas).map((carta, i) => (
          <div key={i} className="col-md-3 mb-4">
            <img src={carta.imagem} alt={carta.nome} className="img-fluid cardimg" />
            <h5 className="mt-2">{carta.nome}</h5>
            <p>{carta.tipo} - {carta.cor}</p>
            <p><strong>x{carta.quantidade}</strong></p>
          </div>
        ))}
      </div>

     
      {salvo ? (
        <p className="text-success mt-4">✅ Este deck já foi salvo.</p>
      ) : (
        <button className="btn btn-outline-primary mt-4" onClick={salvarDeck}>
          💾 Salvar Deck
        </button>
      )}

      
      <div className="d-flex justify-content-center gap-3 mt-3">
      <button
          className="btn btn-outline-success"
          onClick={() => handleVoto('like')}
          disabled={voto === 'like'}
      >
      👍 Like
      </button>

      <button
        className="btn btn-outline-danger"
        onClick={() => handleVoto('dislike')}
        disabled={voto === 'dislike'}
      >
      👎 Dislike
      </button>
    </div>
  </div>
  );
}

export default VisualizarDeckPage;


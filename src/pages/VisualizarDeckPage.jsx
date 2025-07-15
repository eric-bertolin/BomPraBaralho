import React, { useEffect, useState } from 'react';

function VisualizarDeckPage({ deck, setCurrentPage, setDeckSelecionado }) {
  const [salvo, setSalvo] = useState(false);
  const [votoAtual, setVotoAtual] = useState(null); 

  useEffect(() => {
    if (!deck) return;

    // Recupera email do usuário do token
    const token = localStorage.getItem('token');
    let userEmail = '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userEmail = payload.email;
    } catch {}

    fetch('http://localhost:3001/api/decks')
      .then((res) => res.json())
      .then((decks) => {
        // Garante que decks é um array antes de usar .some
        let listaDecks = Array.isArray(decks) ? decks : (decks.decks ? decks.decks : []);
        const jaSalvo = listaDecks.some((d) => d.nome === deck.nome && d.userEmail === userEmail);
        setSalvo(jaSalvo);
      });


    // Busca voto do usuário no deck favorito
    fetch('http://localhost:3001/api/decksFavoritos')
      .then((res) => res.json())
      .then((favoritos) => {
        const existente = favoritos.find(d => d.nome === deck.nome);
        if (existente && existente.votos) {
          const votoUser = existente.votos.find(v => v.email === userEmail);
          setVoto(votoUser ? votoUser.voto : null);
        } else {
          setVoto(null);
        }
      });
  }, [deck]);

  const salvarDeck = async () => {
    const token = localStorage.getItem('token');
    let userEmail = '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userEmail = payload.email;
    } catch {}

    // Verifica se já existe deck salvo
    try {
      const res = await fetch('http://localhost:3001/api/decks');
      const decks = await res.json();
      let listaDecks = Array.isArray(decks) ? decks : (decks.decks ? decks.decks : []);
      const jaSalvo = listaDecks.some((d) => d.nome === deck.nome && d.userEmail === userEmail);
      if (jaSalvo) {
        alert('Este deck já está salvo nos seus decks!');
        setSalvo(true);
        return;
      }
      const novoDeck = {
        nome: deck.nome,
        imagem: deck.imagem || '/IMGS/placeholder.jpg',
        cartas: deck.cartas,
        criadoEm: new Date().toISOString(),
        userEmail
      };
      await fetch('http://localhost:3001/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
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
  // Recupera email do usuário do token
  const token = localStorage.getItem('token');
  let userEmail = '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userEmail = payload.email;
  } catch {}

  try {
    // Busca pelo nome para garantir que existe
    const resBusca = await fetch('http://localhost:3001/api/decksFavoritos');
    const favoritos = await resBusca.json();
    const existente = favoritos.find(d => d.nome === deck.nome);
    let favoritoId = existente ? existente._id : null;
    let res;
    if (favoritoId) {
      // Atualiza deck favorito existente (PUT) - envia apenas email e voto
      res = await fetch(`http://localhost:3001/api/decksFavoritos/${favoritoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, voto: tipo })
      });
    } else {
      // Cria novo deck favorito (POST)
      res = await fetch('http://localhost:3001/api/decksFavoritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: deck.nome,
          cor: deck.cor,
          imagem: deck.imagem,
          cartas: deck.cartas,
          publicadoEm: deck.publicadoEm,
          votos: [{ email: userEmail, voto: tipo }],
          likes: tipo === 'like' ? 1 : 0,
          dislikes: tipo === 'dislike' ? 1 : 0,
          saldo: tipo === 'like' ? 1 : tipo === 'dislike' ? -1 : 0
        })
      });
    }
    if (res.ok) {
      setVoto(tipo);
      setDeckSelecionado({ ...deck });
      alert('Avaliação registrada!');
    } else {
      alert('Erro ao registrar avaliação.');
    }
  } catch (err) {
    alert('Erro ao registrar avaliação. Veja o console.');
    console.error(err);
  }
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


import React, { useState } from 'react';

function Carta({ id, imagem, nome, cor, tipo, onAdd, onRemove }) {
  const [showZoom, setShowZoom] = useState(false);
  const [mongoId, setMongoId] = useState(null); // ✅ Guardar _id retornado do MongoDB

  const handleAdicionar = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/colecao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ nome, imagem, cor, tipo })
      });

      if (!res.ok) throw new Error('Erro ao adicionar carta');

      const data = await res.json();
      setMongoId(data._id);

      alert(`Carta adicionada! ID Mongo: ${data._id}`);

      // Chama função para atualizar coleção após adicionar
      if (typeof onAdicionada === 'function') {
        onAdicionada();
      }
    } catch (err) {
      console.error('Erro ao adicionar carta:', err);
    }

    setShowZoom(false);
  };

  const handleRemover = () => {
    if (onRemove) {
      onRemove(id); // sempre usa o id recebido via props
    }
    setShowZoom(false);
  };

  return (
    <div>
      <img
        src={imagem}
        alt={nome}
        onClick={() => setShowZoom(true)}
        style={{
          height: '300px',
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
          margin: '0 auto',
          cursor: 'pointer'
        }}
      />

      {showZoom && (
        <div
          className="modal"
          onClick={() => setShowZoom(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              padding: 30,
              borderRadius: 12,
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              textAlign: 'center',
              aspectRatio: '5 / 7',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '60vw',
              maxHeight: '75vh'
            }}
          >
            <img
              src={imagem}
              alt={nome}
              style={{
                height: '85vh',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                transition: 'none',
                transform: 'none'
              }}
            />
            {onAdd && (
              <button className="btn btn-success mt-4 me-2" onClick={handleAdicionar}>
                Adicionar à Coleção
              </button>
            )}
            {onRemove && id && (
              <button className="btn btn-danger mt-4" onClick={handleRemover}>
                Remover da Coleção
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Carta;

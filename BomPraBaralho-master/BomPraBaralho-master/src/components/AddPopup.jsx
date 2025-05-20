import React from 'react';

const AddPopup = ({ show, setShow }) => (
  <div id="add-popup" className={show ? 'show shadow' : ''}>
    <div className="popup-content">
      <div className="d-flex justify-content-between align-items-center">
        <h4>Menu de Adição</h4>
        <span id="close-add-popup" onClick={() => setShow(false)}>&times;</span>
      </div>
      <hr />
      <p className="text-muted">Você pode começar a montar seu deck agora:</p>
<button
  className="btn btn-primary"
  onClick={() => {
    setCurrentPage('criar-decks');
    setShow(false);
  }}
>
  Montar Deck
</button>
    </div>
  </div>
);

export default AddPopup;

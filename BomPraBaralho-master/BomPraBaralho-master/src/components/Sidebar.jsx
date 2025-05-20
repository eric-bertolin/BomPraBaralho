import React from 'react';

const Sidebar = ({ show, setShow, setCurrentPage }) => {
  const handleClick = (page) => {
    setCurrentPage(page);
    setShow(false);
  };

  return (
    <nav id="sidebar" className={show ? 'show' : ''}>
      <button id="close-btn" className="btn btn-sm btn-light mb-3" onClick={() => setShow(false)}>✖</button>
      <ul className="list-unstyled">
        <li><a href="#" onClick={() => handleClick('menu')} className="d-block text-white py-2">Início</a></li>
        <li><a href="#" onClick={() => handleClick('pesquisar')} className="d-block text-white py-2">Pesquisar Cartas</a></li>
        <li><a href="#" onClick={() => handleClick('colecao')} className="d-block text-white py-2">Minha Coleção</a></li>
        <li><a href="#" onClick={() => handleClick('meus-decks')} className="d-block text-white py-2">Meus Decks</a></li>
        <li><a href="#" onClick={() => handleClick('comunidade')} className="d-block text-white py-2">Decks da Comunidade</a></li>
      </ul>
    </nav>
  );
};

export default Sidebar;

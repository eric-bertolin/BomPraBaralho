import React from 'react';

const ProfilePopup = ({ show, setShow }) => (
  <div id="profile-popup" className={show ? 'show shadow' : ''}>
    <div className="popup-content">
      <div className="d-flex justify-content-between align-items-center">
        <h4>Seu Perfil</h4>
        <span id="close-popup" onClick={() => setShow(false)}>&times;</span>
      </div>
      <hr />
      <p><strong>Nome:</strong> João da Silva</p>
      <p><strong>Email:</strong> joao@email.com</p>
      <p><strong>Plano:</strong> Premium</p>
    </div>
  </div>
);

export default ProfilePopup;

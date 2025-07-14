
import React from 'react';
import { jwtDecode } from 'jwt-decode';

const ProfilePopup = ({ show, setShow, setShowLogin }) => {
  const token = localStorage.getItem('token');
  let email = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded?.email || 'Usuário';
    } catch (e) {
      console.error('Token inválido:', e);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleLogin = () => {
    setShow(false);
    setShowLogin(true);
  };

  return (
    <div id="profile-popup" className={show ? 'show shadow' : ''}>
      <div className="popup-content text-center">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Perfil</h4>
          <span id="close-popup" onClick={() => setShow(false)} style={{ cursor: 'pointer' }}>&times;</span>
        </div>
        <hr />

        {!token ? (
          <>
            <p>Você não está logado.</p>
            <button className="btn btn-primary mt-3" onClick={handleLogin}>
              Fazer login
            </button>
          </>
        ) : (
          <>
            <p><strong>Email:</strong><br />{email}</p>
            <button className="btn btn-outline-danger mt-3" onClick={handleLogout}>
              Sair
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePopup;

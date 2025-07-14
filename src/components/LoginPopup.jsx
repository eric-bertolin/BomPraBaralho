
import React, { useState } from 'react';

const LoginPopup = ({ show, setShow, onLoginSuccess, onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.erro || 'Erro ao fazer login');
        return;
      }

      localStorage.setItem('token', data.token);
      onLoginSuccess();
    } catch (error) {
      setErro('Erro ao conectar com o servidor');
    }
  };

  if (!show) return null;

  return (
    <div className="popup position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
      <div className="popup-inner bg-light p-4 rounded shadow text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h2>Login</h2>
        <input
          className="form-control my-2"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-control my-2"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && <div className="alert alert-danger mt-2">{erro}</div>}
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-outline-success" onClick={handleLogin}>
            Entrar
          </button>
          <button className="btn btn-outline-primary" onClick={onShowRegister}>
            Criar conta
          </button>
          <button className="btn btn-outline-secondary" onClick={() => setShow(false)}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;

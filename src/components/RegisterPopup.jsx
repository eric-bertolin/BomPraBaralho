
import React, { useState } from 'react';

const RegisterPopup = ({ show, setShow, onRegisterSuccess, onShowLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.erro || 'Erro ao criar conta');
        return;
      }

      setSucesso('Conta criada com sucesso! Faça login.');
      setErro('');
    } catch (error) {
      setErro('Erro ao conectar com o servidor');
    }
  };

  if (!show) return null;

  return (
    <div className="popup position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
      <div className="popup-inner bg-light p-4 rounded shadow text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h2>Criar Conta</h2>
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
        {sucesso && <div className="alert alert-success mt-2">{sucesso}</div>}
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-outline-success" onClick={handleRegister}>
            Cadastrar
          </button>
          <button className="btn btn-outline-secondary" onClick={() => setShow(false)}>
            Cancelar
          </button>
        </div>
        <p className="mt-3">
          Já tem uma conta?{' '}
          <button className="btn btn-link p-0" onClick={onShowLogin}>
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPopup;

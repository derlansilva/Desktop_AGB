import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);



    const handleLogin = (event) => {
        event.preventDefault();

        setLoading(true);  // Ativa o spinner

        // Simula um carregamento de 2 segundos
        setTimeout(() => {
            setLoading(false); // Desativa o spinner
            navigate('/home'); // Redireciona para a Home após 2 segundos
        }, 2000);

    
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            
            
            <div className="card shadow-lg" style={{ width: '400px' }}>

            {loading ? (
            // Exibe o spinner enquanto o login está sendo processado
            <div className="d-flex justify-content-center mb-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (

                <div className="card-body">
                    <h3 className="card-title text-center mb-4 text-primary">
                        <img src="/logo.png"
                            className="me-2"
                            style={{ width: '200px', height: '50px', objectFit: 'cover' }} />
                    </h3>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="number" className="form-label">Matricula</label>
                            <input
                                type="number"
                                className="form-control"
                                id="username"
                                placeholder="Entre com sua matricula"
                                required
                                style={{
                                    appearance: 'none',         /* Remove as setas no Chrome, Safari */
                                    MozAppearance: 'textfield', /* Remove as setas no Firefox */
                                    WebkitAppearance: 'none',   /* Remove as setas no Webkit browsers */
                                    margin: 0,                  /* Ajuste de margem para evitar espaço extra */
                                    paddingRight: '0px'         /* Remove o preenchimento da direita */
                                }}

                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                            />
                            <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                        </div>

                        <div className="d-grid gap-2 mb-3">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>

                        <div className="text-center">
                            <a href="/forgot-password" className="text-primary">Forgot Password?</a>
                        </div>
                    </form>
                </div>
          )}
            </div>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../service/authService';
import Logo from './Instagram.png';
import './login.css';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await authService.login(username, password);
            navigate('/home');
        } catch (error) {
            console.error('Login failed', error);
            setError('Invalid username or password');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleLogin} className="card card-body">
                        <div className="text-center mb-4">
                            <img src={Logo} alt="Instagram" className="mb-4" />
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="col-auto mb-3">
                            <label className="visually-hidden" htmlFor="autoSizingInputGroup">Username</label>
                            <div className="input-group">
                                <div className="input-group-text">@</div>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="autoSizingInputGroup"
                                    placeholder="Usuário"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Senha</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Coloque sua senha aqui"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Log In</button>
                        <p className="text-center mt-2">
                            Não possui conta? <a href="/signup">Cadastre-se</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;

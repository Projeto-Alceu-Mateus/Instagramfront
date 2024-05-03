import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../service/authService'; // Verifique se o caminho está correto
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Signup() {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            // Removemos o campo confirmPassword antes de enviar
            const { confirmPassword, ...dataToSend } = formData;
            const response = await authService.signup(dataToSend);
            console.log('Signup successful', response);
            navigate('/login'); // Redireciona para login após cadastro bem-sucedido
        } catch (error) {
            console.error('Signup failed', error);
            setError('Failed to signup. Please try again.');
        }
    };
    const handleBack = () => {
        navigate('/login');
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <button onClick={handleBack} className="btn btn-link">
                        <FontAwesomeIcon icon={faArrowLeft} /> Voltar
                    </button>
                    <form onSubmit={handleSubmit} className="card card-body">
                        <h3 className="text-center mb-3">Cadastro</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="mb-3">
                            <label className="form-label">Nome Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Usuário</label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">E-mail</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Senha</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirme sua Senha</label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;

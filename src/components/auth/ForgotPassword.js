import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ForgotPassword.css';
import { validatePassword, validateConfirmPassword } from '../functions/validationFunctions';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [passwordValidation, setPasswordValidation] = useState({
        length: null,
        number: null,
        specialChar: null,
        noWhitespace: null
    });
    const [confirmPasswordValidation, setConfirmPasswordValidation] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (newPassword) {
            setPasswordValidation(validatePassword(newPassword));
        }
    }, [newPassword]);

    useEffect(() => {
        if (confirmPassword) {
            setConfirmPasswordValidation(validateConfirmPassword(newPassword, confirmPassword));
        }
    }, [newPassword, confirmPassword]);

    const handleForgotPassword = async () => {
        try {
            await axios.post('http://localhost:8080/auth/forgot-password', { email });
            setStep(2);
            setMessage('Código de verificação enviado para o seu email.');
            setError('');
        } catch (error) {
            setError('Erro ao enviar código de verificação. Verifique se o email está correto.');
            setMessage('');
        }
    };

    const handleVerifyCode = async () => {
        try {
            await axios.post('http://localhost:8080/auth/verify-code', { email, code });
            setStep(3);
            setMessage('Código verificado. Agora você pode redefinir sua senha.');
            setError('');
        } catch (error) {
            setError('Código de verificação inválido.');
            setMessage('');
        }
    };

    const handleResetPassword = async () => {
        if (!Object.values(passwordValidation).every(Boolean)) {
            setError('Por favor, preencha os requisitos da senha.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        try {
            await axios.post('http://localhost:8080/auth/reset-password', { email, code, newPassword });
            setMessage('Senha redefinida com sucesso. Redirecionando para login...');
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setError('Erro ao redefinir a senha. Tente novamente.');
            setMessage('');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center">
                <div className="col-6 col-md-4">
                    <div className="card card-body forgot-password-card">
                        {step === 1 && (
                            <>
                                <h3>Recuperar Senha</h3>
                                {message && <div className="alert alert-success">{message}</div>}
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Digite seu email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button onClick={handleForgotPassword} className="btn btn-primary w-100">
                                    Enviar Código
                                </button>
                                <button onClick={() => navigate('/login')} className="btn btn-link w-100">
                                    Voltar para o Login
                                </button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <h3>Verificar Código</h3>
                                {message && <div className="alert alert-success">{message}</div>}
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Digite o código de verificação"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                    />
                                </div>
                                <button onClick={handleVerifyCode} className="btn btn-primary w-100">
                                    Verificar Código
                                </button>
                                <button onClick={() => navigate('/login')} className="btn btn-link w-100">
                                    Voltar para o Login
                                </button>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <h3>Redefinir Senha</h3>
                                {message && <div className="alert alert-success">{message}</div>}
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Digite a nova senha"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <div className="password-requirements">
                                        <div className={passwordValidation.length === null ? '' : passwordValidation.length ? 'valid' : 'invalid'}>
                                            <FontAwesomeIcon icon={passwordValidation.length ? faCheck : faTimes} /> Pelo menos 4 caracteres
                                        </div>
                                        <div className={passwordValidation.number === null ? '' : passwordValidation.number ? 'valid' : 'invalid'}>
                                            <FontAwesomeIcon icon={passwordValidation.number ? faCheck : faTimes} /> Pelo menos 1 número
                                        </div>
                                        <div className={passwordValidation.specialChar === null ? '' : passwordValidation.specialChar ? 'valid' : 'invalid'}>
                                            <FontAwesomeIcon icon={passwordValidation.specialChar ? faCheck : faTimes} /> Pelo menos 1 caractere especial
                                        </div>
                                        <div className={passwordValidation.noWhitespace === null ? '' : passwordValidation.noWhitespace ? 'valid' : 'invalid'}>
                                            <FontAwesomeIcon icon={passwordValidation.noWhitespace ? faCheck : faTimes} /> Sem espaços em branco
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className={`form-control ${confirmPasswordValidation === null ? '' : confirmPasswordValidation ? 'is-valid' : 'is-invalid'}`}
                                        placeholder="Confirme a nova senha"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    {confirmPasswordValidation === false && <div className="invalid-feedback">As senhas não coincidem.</div>}
                                    {confirmPasswordValidation === true && <div className="valid-feedback">As senhas coincidem.</div>}
                                </div>
                                <button onClick={handleResetPassword} className="btn btn-primary w-100">
                                    Redefinir Senha
                                </button>
                                <button onClick={() => navigate('/login')} className="btn btn-link w-100">
                                    Voltar para o Login
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;

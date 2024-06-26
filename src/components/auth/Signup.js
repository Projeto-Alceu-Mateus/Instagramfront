import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
    validateFullName,
    checkUsernameAvailability,
    checkEmailAvailability,
    validatePassword,
    validateConfirmPassword
} from '../functions/validationFunctions';
import authService from '../service/authService'; // Certifique-se de que o caminho está correto
import './Signup.css';

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [validation, setValidation] = useState({
        fullName: null,
        username: null,
        usernameError: '',
        email: null,
        emailError: '',
        password: {
            length: null,
            number: null,
            specialChar: null,
            noWhitespace: null
        },
        confirmPassword: null
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.fullName) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                fullName: validateFullName(formData.fullName)
            }));
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                fullName: null
            }));
        }
    }, [formData.fullName]);

    useEffect(() => {
        const checkUsername = async () => {
            const result = await checkUsernameAvailability(formData.username);
            setValidation((prevValidation) => ({
                ...prevValidation,
                username: result.isValid,
                usernameError: result.message
            }));
        };
        if (formData.username) {
            checkUsername();
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                username: null,
                usernameError: ''
            }));
        }
    }, [formData.username]);

    useEffect(() => {
        const checkEmail = async () => {
            const result = await checkEmailAvailability(formData.email);
            setValidation((prevValidation) => ({
                ...prevValidation,
                email: result.isValid,
                emailError: result.message
            }));
        };
        if (formData.email) {
            checkEmail();
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                email: null,
                emailError: ''
            }));
        }
    }, [formData.email]);

    useEffect(() => {
        if (formData.password) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                password: validatePassword(formData.password)
            }));
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                password: {
                    length: null,
                    number: null,
                    specialChar: null,
                    noWhitespace: null
                }
            }));
        }
    }, [formData.password]);

    useEffect(() => {
        if (formData.confirmPassword) {
            setValidation((prevValidation) => ({
                ...prevValidation,
                confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
            }));
        } else {
            setValidation((prevValidation) => ({
                ...prevValidation,
                confirmPassword: null
            }));
        }
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validation.fullName || !validation.username || !validation.email || !validation.confirmPassword ||
            !Object.values(validation.password).every(Boolean)) {
            setError('Por favor, preencha o formulário corretamente.');
            return;
        }
        try {
            const { confirmPassword, ...dataToSend } = formData;
            const response = await authService.signup(dataToSend);
            console.log('Cadastro bem-sucedido', response);
            navigate('/login');
        } catch (error) {
            console.error('Falha no cadastro', error);
            setError('Falha ao cadastrar. Por favor, tente novamente.');
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
                                className={`form-control ${validation.fullName === null ? '' : validation.fullName ? 'is-valid' : 'is-invalid'}`}
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            {validation.fullName === false && <div className="invalid-feedback">Nome completo necessário.</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Usuário</label>
                            <input
                                type="text"
                                className={`form-control ${validation.username === null ? '' : validation.username ? 'is-valid' : 'is-invalid'}`}
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            {validation.username === false && <div className="invalid-feedback">{validation.usernameError}</div>}
                            {validation.username === true && <div className="valid-feedback">Usuário disponível para cadastro.</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">E-mail</label>
                            <input
                                type="email"
                                className={`form-control ${validation.email === null ? '' : validation.email ? 'is-valid' : 'is-invalid'}`}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {validation.email === false && <div className="invalid-feedback">{validation.emailError}</div>}
                            {validation.email === true && <div className="valid-feedback">E-mail disponível para cadastro.</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Senha</label>
                            <input
                                type="password"
                                className={`form-control ${Object.values(validation.password).every(val => val === null) ? '' : Object.values(validation.password).every(Boolean) ? 'is-valid' : 'is-invalid'}`}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <div className="password-requirements">
                                <div className={validation.password.length === null ? '' : validation.password.length ? 'valid' : 'invalid'}>
                                    <FontAwesomeIcon icon={validation.password.length ? faCheck : faTimes} /> Pelo menos 4 caracteres
                                </div>
                                <div className={validation.password.number === null ? '' : validation.password.number ? 'valid' : 'invalid'}>
                                    <FontAwesomeIcon icon={validation.password.number ? faCheck : faTimes} /> Pelo menos 1 número
                                </div>
                                <div className={validation.password.specialChar === null ? '' : validation.password.specialChar ? 'valid' : 'invalid'}>
                                    <FontAwesomeIcon icon={validation.password.specialChar ? faCheck : faTimes} /> Pelo menos 1 caractere especial
                                </div>
                                <div className={validation.password.noWhitespace === null ? '' : validation.password.noWhitespace ? 'valid' : 'invalid'}>
                                    <FontAwesomeIcon icon={validation.password.noWhitespace ? faCheck : faTimes} /> Sem espaços em branco
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirme sua Senha</label>
                            <input
                                type="password"
                                className={`form-control ${validation.confirmPassword === null ? '' : validation.confirmPassword ? 'is-valid' : 'is-invalid'}`}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {validation.confirmPassword === false && <div className="invalid-feedback">As senhas não coincidem.</div>}
                            {validation.confirmPassword === true && <div className="valid-feedback">As senhas coincidem.</div>}
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;

import React, { useState, useEffect } from 'react';
import './Configuracoes.css';
import Sidebar from '../sidebar/Sidebar.js';
import '../assets/css/home.css';
import SearchPopup from '../service/SearchPopup';
import NewPostPopup from '../service/NewPostPopup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { validatePassword, validateConfirmPassword, checkEmailAvailability } from '../functions/validationFunctions';

function Configuracoes() {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showNewPostPopup, setShowNewPostPopup] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [emailAvailable, setEmailAvailable] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        length: null,
        number: null,
        specialChar: null,
        noWhitespace: null
    });
    const [confirmPasswordValidation, setConfirmPasswordValidation] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token);
    const loggedInUsername = decoded.sub;

    useEffect(() => {
        const checkEmail = async () => {
            const result = await checkEmailAvailability(emailInput);
            setEmailAvailable(result.isValid);
            setEmailError(result.message);
        };

        if (emailInput) {
            checkEmail();
        } else {
            setEmailAvailable(null);
            setEmailError('');
        }
    }, [emailInput]);

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

    const deleteAccount = async () => {
        if (window.confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível!')) {
            try {
                await axios.delete(`http://localhost:8080/user/${loggedInUsername}`);
                localStorage.removeItem('userToken');
                navigate('/login');
            } catch (error) {
                console.error('Erro ao deletar conta:', error);
                alert('Erro ao deletar conta. Tente novamente mais tarde.');
            }
        }
    };

    const changePassword = async () => {
        if (!Object.values(passwordValidation).every(Boolean)) {
            alert('Por favor, preencha os requisitos da senha.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('A nova senha e a confirmação de senha não coincidem.');
            return;
        }
        try {
            await axios.put('http://localhost:8080/auth/change-password', {
                username: loggedInUsername,
                oldPassword,
                newPassword
            });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            alert('Erro ao alterar senha. Tente novamente mais tarde.');
        }
    };

    const changeEmail = async () => {
        if (!emailAvailable) {
            alert(emailError);
            return;
        }
        try {
            await axios.put('http://localhost:8080/user/change-email', {
                username: loggedInUsername,
                email: emailInput
            });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error('Erro ao alterar email:', error);
            alert('Erro ao alterar email. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
                <div className="col-md-9 col-lg-10 feed">
                    <h1>Configurações</h1>
                    <button className="delete-account-btn" onClick={deleteAccount}>Deletar Conta</button>
                    <button
                        className="change-password-btn"
                        onClick={() => {
                            setShowChangePassword(!showChangePassword);
                            setShowChangeEmail(false);
                        }}
                    >
                        Trocar Senha
                    </button>
                    {showChangePassword && (
                        <div className="change-password-form">
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="form-control"
                                placeholder="Senha Antiga"
                            />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="form-control"
                                placeholder="Nova Senha"
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
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`form-control ${confirmPasswordValidation === null ? '' : confirmPasswordValidation ? 'is-valid' : 'is-invalid'}`}
                                placeholder="Confirmar Nova Senha"
                            />
                            {confirmPasswordValidation === false && <div className="invalid-feedback">As senhas não coincidem.</div>}
                            {confirmPasswordValidation === true && <div className="valid-feedback">As senhas coincidem.</div>}
                            <button className="save-password-btn" onClick={changePassword}>Salvar Senha</button>
                        </div>
                    )}
                    <button
                        className="change-password-btn"
                        onClick={() => {
                            setShowChangeEmail(!showChangeEmail);
                            setShowChangePassword(false);
                        }}
                    >
                        Trocar Email
                    </button>
                    {showChangeEmail && (
                        <div className="change-password-form">
                            <div className="form-group">
                                <input
                                    type="email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    className={`form-control ${emailAvailable === null ? '' : emailAvailable ? 'is-valid' : 'is-invalid'}`}
                                    placeholder="Novo Email"
                                />
                                <span className={`email-status ${emailAvailable === null ? '' : emailAvailable ? 'valid' : 'invalid'}`}>
                                    {emailAvailable === null ? '' : emailAvailable ? 'Email disponível' : emailError}
                                </span>
                            </div>
                            <button className="save-password-btn" onClick={changeEmail} disabled={emailAvailable === false}>Salvar Email</button>
                        </div>
                    )}
                    {showSuccessMessage && (
                        <div className="alert alert-success" role="alert">
                            Operação realizada com sucesso!
                        </div>
                    )}
                </div>

                {showSearchPopup && <SearchPopup closePopup={() => setShowSearchPopup(false)} />}
                {showNewPostPopup && <NewPostPopup closePopup={() => setShowNewPostPopup(false)} />}
            </div>
        </div>
    );
}

export default Configuracoes;

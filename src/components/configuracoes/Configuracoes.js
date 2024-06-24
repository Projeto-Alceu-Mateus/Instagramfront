import React, { useState, useEffect } from 'react';
import './Configuracoes.css';
import Sidebar from '../sidebar/Sidebar.js';
import '../assets/css/home.css';
import SearchPopup from '../service/SearchPopup';
import NewPostPopup from '../service/NewPostPopup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token);
    const loggedInUsername = decoded.sub;

    useEffect(() => {
        if (emailInput) {
            axios.get(`http://localhost:8080/user/check-email`, { params: { email: emailInput } })
                .then(response => {
                    setEmailAvailable(!response.data);
                })
                .catch(error => console.error('Failed to check email availability:', error));
        } else {
            setEmailAvailable(null);
        }
    }, [emailInput]);

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
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-control"
                                placeholder="Confirmar Nova Senha"
                            />
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
                                    {emailAvailable === null ? '' : emailAvailable ? 'Email disponível' : 'Email já está em uso'}
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

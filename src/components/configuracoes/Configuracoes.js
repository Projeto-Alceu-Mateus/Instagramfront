import React, { useState } from 'react';
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
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token);
    const loggedInUsername = decoded.sub;

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
        if (newPassword !== confirmNewPassword) {
            alert('As novas senhas não coincidem');
            return;
        }
        try {
            const response = await axios.put('http://localhost:8080/auth/change-password', {
                username: loggedInUsername,
                oldPassword,
                newPassword
            });
            if (response.status === 200) {
                alert('Senha alterada com sucesso');
                setShowChangePassword(false);
            }
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            alert('Erro ao alterar senha. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
                <div className="col-md-9 col-lg-10 feed">
                    <h1>Configurações</h1>
                    <button onClick={deleteAccount} className="delete-account-btn">
                        Deletar Conta
                    </button>
                    <button onClick={() => setShowChangePassword(!showChangePassword)} className="change-password-btn">
                        Alterar Senha
                    </button>
                    {showChangePassword && (
                        <div className="change-password-form">
                            <input
                                type="password"
                                placeholder="Senha antiga"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="form-control"
                            />
                            <input
                                type="password"
                                placeholder="Nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="form-control"
                            />
                            <input
                                type="password"
                                placeholder="Confirme a nova senha"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="form-control"
                            />
                            <button onClick={changePassword} className="save-password-btn">
                                Salvar Nova Senha
                            </button>
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

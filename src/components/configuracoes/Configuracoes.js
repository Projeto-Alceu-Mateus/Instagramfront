import React, { useState } from 'react';
import './Configuracoes.css';
import Sidebar from '../sidebar/Sidebar.js';
import '../assets/css/home.css';
import SearchPopup from '../service/SearchPopup';
import NewPostPopup from '../service/NewPostPopup';

function Configuracoes() {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showNewPostPopup, setShowNewPostPopup] = useState(false);

    const deleteAccount = () => {
        if (window.confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível!')) {
            // Adicione a lógica para deletar a conta aqui
            console.log("Conta deletada");
        }
    };

    return (
    <div className="container-fluid h-100">
        <div className="row h-100">
            <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
            <div className="col-md-9 col-lg-10 feed">
                <h1>Configurações</h1>
                <button >
                    Alternar para Modo 
                </button>
                <button onClick={deleteAccount} style={{ backgroundColor: 'red', color: 'white', marginTop: '20px' }}>
                    Deletar Conta
                </button>
            </div>

            {showSearchPopup && <SearchPopup closePopup={() => setShowSearchPopup(false)} />}
            {showNewPostPopup && <NewPostPopup closePopup={() => setShowNewPostPopup(false)} />}
        </div>
    </div>

    );
}

export default Configuracoes;

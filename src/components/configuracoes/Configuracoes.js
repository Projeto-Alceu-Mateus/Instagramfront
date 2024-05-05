import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext.js'; // Supondo que você tenha um contexto para os temas
import './Configuracoes.css';
import Sidebar from '../sidebar/Sidebar.js';


function Configuracoes() {
    const { theme, setTheme } = useContext(ThemeContext); // Usando o contexto para obter o tema atual e a função para alterar o tema

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const deleteAccount = () => {
        if (window.confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível!')) {
            // Adicione a lógica para deletar a conta aqui
            console.log("Conta deletada");
        }
    };

    return (
        <div className="configuracoes">
            <Sidebar />
            <h1>Configurações</h1>
            <button onClick={toggleTheme}>
                Alternar para Modo {theme === 'light' ? 'Escuro' : 'Claro'}
            </button>
            <button onClick={deleteAccount} style={{ backgroundColor: 'red', color: 'white', marginTop: '20px' }}>
                Deletar Conta
            </button>
        </div>
    );
}

export default Configuracoes;

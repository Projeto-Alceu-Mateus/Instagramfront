import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome, faSearch, faPlusSquare, faUser, faCog, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import Logo from './Instagram.png';
import { jwtDecode } from 'jwt-decode';



function Sidebar({ setShowSearchPopup, setShowNewPostPopup }) {
    let username = "defaultUser";

    const token = localStorage.getItem('userToken');
    if (token) {
        const decoded = jwtDecode(token);
        username = decoded.sub; // O 'subject' do token é configurado para ser o email do usuário no backend
    }
    const handleLinkClick = (username) => {
        window.location.href = `/perfil/${username}`; // Isto força o navegador a carregar a página como um novo pedido
    };
    const handHomeClick = () => {
        window.location.href = `/home`; // Isto força o navegador a carregar a página como um novo pedido
    };
    const handleLogout = () => {
        localStorage.removeItem('userToken'); // Supondo que você use localStorage para tokens
        window.location = '/login'; // Redireciona para a tela de login
    };

    return (
        <div className="col-md-3 col-lg-2 d-flex flex-column min-vh-100 bg-light sidebar">
            <div className='logo'>
                <Link className="nav-link" to="/home">
                    <img src={Logo} alt="Instagram" className="logo" to="/home" onClick={handHomeClick}/>
                </Link>
            </div>
            <ul className="nav flex-column nav-flex-grow">
                <li className="nav-item">
                    <Link className="nav-link" onClick={handHomeClick} ><FontAwesomeIcon icon={faHome} className="fa-icon" /> Página Inicial</Link>
                </li>
                <li className="nav-item">
                    <button className="nav-link" onClick={() => setShowSearchPopup(true)}><FontAwesomeIcon icon={faSearch} className="fa-icon" /> Pesquisar</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link" onClick={() => setShowNewPostPopup(true)}><FontAwesomeIcon icon={faPlusSquare} className="fa-icon" /> Novo Post</button>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" href="#" onClick={() => handleLinkClick(username)}><FontAwesomeIcon icon={faUser} className="fa-icon" /> Perfil</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/Configuracoes"><FontAwesomeIcon icon={faCog} className="fa-icon" /> Configurações</Link>
                </li>
                <li className="nav-item">
                    <button className="nav-link" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="fa-icon" /> Sair
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;

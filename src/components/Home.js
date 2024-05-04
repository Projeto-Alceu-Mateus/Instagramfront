import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './assets/css/home.css';

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <div className="col-md-3 col-lg-2 d-flex flex-column min-vh-100 bg-light sidebar">
                    <ul className="nav flex-column nav-flex-grow">
                        <li className="nav-item">
                            <Link className="nav-link" to="/pagina-inicial">Página Inicial</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/pesquisar">Pesquisar</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/novo-post">Novo Post</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/perfil">Perfil</Link>
                        </li>
                    </ul>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <button className="btn btn-link nav-link" onClick={handleLogout}>Sair</button>
                        </li>
                    </ul>
                </div>
                <div className="col-md-9 col-lg-10 feed">
                    <h1>FEED</h1>
                    {/* Aqui você pode adicionar os componentes ou conteúdo do feed */}
                </div>
            </div>
        </div>
    );
}

export default Home;

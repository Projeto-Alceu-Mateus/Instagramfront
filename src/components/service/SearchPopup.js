import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importa o componente Link do React Router

function SearchPopup({ closePopup }) {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        if (searchTerm.length > 0) {
            setLoading(true);
            axios.get(`http://localhost:8080/user/search?username=${searchTerm}`)
                .then(response => {
                    setSearchResults(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.log('Error fetching search results', error);
                    setLoading(false);
                });
        } else {
            setSearchResults([]);
        }
    };

    const handleLinkClick = (username) => {
        window.location.href = `/perfil/${username}`; // Isto força o navegador a carregar a página como um novo pedido
    };

    return (
        <div className="popup search-popup">
            <div className="button-container">
                <button className="close-btn" onClick={closePopup}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <input type="text" placeholder="Pesquisar..." className="search-input" autoFocus onChange={handleSearch} />
            {loading && <div>Loading...</div>}
            {searchResults.length > 0 && (
                <ul className="search-results">
                    {searchResults.map(result => (
                        <li key={result.id} className="search-result-item">
                            <a className="searchLink" href="#" onClick={() => handleLinkClick(result.username)}>
                                <img
                                    src={result.profilePicture}
                                    alt="User Profile"
                                    className='profile-pic'
                                />
                                {result.username}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchPopup;

import React, { useState } from 'react';

function SearchPopup({ closePopup }) {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (event) => {
        // Simular resultados de busca
        if (event.target.value.length > 2) {
            setSearchResults([
                { id: 1, name: "Usuário A" },
                { id: 2, name: "Usuário B" },
                { id: 3, name: "Usuário C" }
            ]);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div className="popup search-popup">
            <button className="close-btn" onClick={closePopup}>×</button>
            <input type="text" placeholder="Pesquisar..." className="search-input" autoFocus onChange={handleSearch} />
            {searchResults.length > 0 && (
                <ul className="search-results">
                    {searchResults.map(result => (
                        <li key={result.id} className="search-result-item">
                            {result.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchPopup;

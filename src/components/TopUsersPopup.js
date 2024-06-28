import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TopUsersPopup.css';

function TopUsersPopup({ closePopup }) {
    const [topUsers, setTopUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/top-users');
                setTopUsers(response.data);
            } catch (error) {
                console.error('Erro ao buscar os usuários com mais seguidores:', error);
            }
        };

        fetchTopUsers();
    }, []);

    const handleUserClick = (username) => {
        navigate(`/perfil/${username}`);
        closePopup();
    };

    return (
        <div className="top-users-popup">
            <button className="close-btn" onClick={closePopup}>X</button>
            <h2>Destaques</h2>
            <ul>
                {topUsers.map(user => (
                    <li key={user.username} onClick={() => handleUserClick(user.username)} className="clickable">
                        <img src={user.profilePicture} alt={user.username} className="profile-pic-small" />
                        <span>{user.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopUsersPopup;
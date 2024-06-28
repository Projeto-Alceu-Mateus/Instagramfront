import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Popup.css'; // Certifique-se de criar ou ajustar este arquivo CSS para estilização

function FollowersPopup({ username, closePopup }) {
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/${username}/following`);
                setFollowers(response.data);
            } catch (error) {
                console.error('Erro ao buscar seguidores:', error);
            }
        };

        fetchFollowers();
    }, [username]);

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={closePopup}>X</button>
                <h2>Seguidores</h2>
                <ul>
                    {followers.map(follower => (
                        <li key={follower.username}>
                            <img src={follower.profilePicture} alt={follower.username} className="profile-pic-small" />
                            <span>{follower.username}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FollowersPopup;
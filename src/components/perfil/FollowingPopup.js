import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Popup.css'; // Certifique-se de criar ou ajustar este arquivo CSS para estilização

function FollowingPopup({ username, closePopup }) {
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/${username}/followers`);
                setFollowing(response.data);
            } catch (error) {
                console.error('Erro ao buscar seguidos:', error);
            }
        };

        fetchFollowing();
    }, [username]);

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={closePopup}>X</button>
                <h2>Seguindo</h2>
                <ul>
                    {following.map(followed => (
                        <li key={followed.username}>
                            <img src={followed.profilePicture} alt={followed.username} className="profile-pic-small" />
                            <span>{followed.username}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FollowingPopup;
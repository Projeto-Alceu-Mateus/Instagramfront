import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LikesPopup.css';

function LikesPopup({ postId, onClose }) {
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/${postId}/likes/users`);
                setLikes(response.data);
            } catch (error) {
                console.error('Erro ao buscar curtidas', error);
            }
        };

        fetchLikes();
    }, [postId]);

    return (
        <div className="likes-popup">
            <div className="likes-popup-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>Curtidas</h2>
                <ul>
                    {likes.map(like => (
                        <li key={like.id}>
                            <img src={like.profilePicture} alt={like.username} className="profile-pic" />
                            <span>{like.username}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default LikesPopup;
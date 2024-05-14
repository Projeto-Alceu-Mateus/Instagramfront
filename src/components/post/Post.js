import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import './Post.css'; // Certifique-se de que o caminho para o CSS está correto

function Post({ post }) {
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token);
    const loggedInUsername = decoded.sub;

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount);

    // Carrega o estado inicial do like do usuário para o post
    useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/${post.postId}/likes/check-like`, {
                    headers: { "username": loggedInUsername }
                });
                setLiked(response.data);
            } catch (error) {
                console.error('Error checking like status', error);
            }
        };

        checkLikeStatus();
    }, [post.postId, loggedInUsername]);

    const toggleLike = async () => {
        if (liked) {
            try {
                await axios.delete(`http://localhost:8080/api/posts/${post.postId}/likes`, { headers: { "username": loggedInUsername } });
                setLiked(false);
                setLikeCount(prev => prev - 1);
            } catch (error) {
                console.error('Erro ao remover like', error);
            }
        } else {
            try {
                await axios.post(`http://localhost:8080/api/posts/${post.postId}/likes`, {}, { headers: { "username": loggedInUsername } });
                setLiked(true);
                setLikeCount(prev => prev + 1);
            } catch (error) {
                console.error('Erro ao adicionar like', error);
            }
        }
    };
    const handleLinkClick = (username) => {
        window.location.href = `/perfil/${username}`;
    };

    return (
        <Fragment>
            <div className="post">
                <div className="post-header">
                    <img src={post.userSummary.profilePictureUrl} alt={post.userSummary.username} className="profile-pic" onClick={() => handleLinkClick(post.userSummary.username)} />
                    <h4 onClick={() => handleLinkClick(post.userSummary.username)}>{post.userSummary.username} </h4>
                </div>
                <img src={post.imageUrl} alt="Post content" className="post-image" />
                <div className="post-caption">
                    <div className="like-section">

                        <FontAwesomeIcon className={`like-button ${liked ? 'liked' : ''}`} onClick={toggleLike} icon={liked ? fasHeart : farHeart} size="lg" />

                        <hr className="barraLike" />
                    </div>
                    <p>{likeCount} curtidas</p>
                    <p>{post.caption}</p>
                </div>
            </div>
            <div className="footer">
                <hr />
            </div>
        </Fragment>
    );
}

export default Post;

import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart, faTrash, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import './Post.css'; // Certifique-se de que o caminho para o CSS está correto

function Post({ post }) {
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token);
    const loggedInUsername = decoded.sub;

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

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

        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/comments/post/${post.postId}`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments', error);
            }
        };

        checkLikeStatus();
        fetchComments();
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

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/comments`, {
                postId: post.postId,
                username: loggedInUsername,
                content: commentContent
            });
            setComments([...comments, response.data]);
            setCommentContent('');
        } catch (error) {
            console.error('Erro ao adicionar comentário', error);
        }
    };

    const handleDeletePost = async () => {
        try {
            await axios.delete(`http://localhost:8080/p/${post.postId}`, {
                headers: { "username": loggedInUsername }
            });
            window.location.href = `/perfil/${loggedInUsername}`;
        } catch (error) {
            console.error('Erro ao deletar post', error);
        }
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const displayedComments = showAllComments ? comments : comments.slice(0, 3);

    return (
        <Fragment>
            <div className="post">
                <div className="post-header">
                    <div className="post-user-info" onClick={() => handleLinkClick(post.userSummary.username)}>
                        <img src={post.userSummary.profilePictureUrl} alt={post.userSummary.username} className="profile-pic" />
                        <h4>{post.userSummary.username}</h4>
                    </div>
                    {loggedInUsername === post.userSummary.username && (
                        <div className="post-menu">
                            <FontAwesomeIcon icon={faEllipsisH} onClick={toggleMenu} />
                            {showMenu && (
                                <div className="post-menu-options">
                                    <button onClick={handleDeletePost}>
                                        <FontAwesomeIcon icon={faTrash} /> Excluir
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <img src={post.imageUrl} alt="Post content" className="post-image" />
                <div className="post-caption">
                    <div className="like-section">
                        <FontAwesomeIcon className={`like-button ${liked ? 'liked' : ''}`} onClick={toggleLike} icon={liked ? fasHeart : farHeart} size="lg" />
                        <hr className="barraLike" />
                    </div>
                    <strong>{likeCount} curtidas</strong>
                    <p>{post.caption}</p>
                </div>
                <div className="comments-section">
                    {displayedComments.map(comment => (
                        <div key={comment.id} className="comment">
                            <strong className='usernameComment' onClick={() => handleLinkClick(comment.username)}>{comment.username}:</strong> {comment.content}
                        </div>
                    ))}
                    {comments.length > 3 && !showAllComments && (
                        <button className="show-all-comments" onClick={() => setShowAllComments(true)}>
                            Ver todos os comentários
                        </button>
                    )}
                </div>
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <img src={post.userSummary.profilePictureUrl} alt={loggedInUsername} className="profile-pic comment-profile-pic" />
                    <input
                        type="text"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Adicione um comentário..."
                        required
                    />
                    <button type="submit">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </form>
            </div>
            <div className="footer">
                <hr />
            </div>
        </Fragment>
    );
}

export default Post;

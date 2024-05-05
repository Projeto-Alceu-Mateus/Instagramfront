import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import './Post.css';
function Post({ username, profilePic, mainImage, likes, caption }) {
    return (
        <div className="post">
            <div className="post-header">
                <img src={profilePic} alt={username} className="profile-pic" />
                <div className="user-details">
                    <strong>{username}</strong>
                </div>
            </div>
            <img src={mainImage} alt="Post" className="post-image" />
            <div className="post-footer">
                <div className="actions">
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <FontAwesomeIcon icon={faComment} />
                    <FontAwesomeIcon icon={faShare} />
                </div>
                <p className="likes">{likes} likes</p>
                <p>{caption}</p>
            </div>
        </div>
    );
}

export default Post;

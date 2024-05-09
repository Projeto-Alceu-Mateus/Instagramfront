import React from 'react';
import './PostCard.css';
function PostCard({ post }) {
    return (
        <div className="post-card">
            <img src={post.imageUrl} alt={post.description} className="post-image" />
        </div>
    );
}

export default PostCard;

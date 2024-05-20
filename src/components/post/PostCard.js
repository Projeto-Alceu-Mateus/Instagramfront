import React from 'react';
import './PostCard.css';
function PostCard({ post }) {
    const irPub = () => {
        window.location.href = `/p/${post.postId}`;
    }
    console.log(post);
    return (
        <div className="post-card">
            <img src={post.imageUrl} onClick={irPub} alt={post.description} className="post-image" />
        </div>
    );
}

export default PostCard;

import React, { Fragment } from 'react';
import './Post.css'; // Importa o CSS ajustado

function Post({ post }) {


    const handleLinkClick = (username) => {
        window.location.href = `/perfil/${username}`; // Isto força o navegador a carregar a página como um novo pedido
    };
    return (
        <Fragment>

            <div className="post">
                <div className="post-header">
                    <a className="searchLink" onClick={() => handleLinkClick(post.userSummary.username)}> <img src={post.userSummary.profilePictureUrl} alt={post.userSummary.username} className="profile-pic" />
                        <h4>{post.userSummary.username} </h4>
                    </a>
                </div>
                <img src={post.imageUrl} alt="Post content" className="post-image" />
                <div className="post-caption">
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

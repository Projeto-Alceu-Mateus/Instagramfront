import React, { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import SearchPopup from './service/SearchPopup';
import NewPostPopup from './service/NewPostPopup';
import './assets/css/home.css';
import Post from './post/Post';
function Home() {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showNewPostPopup, setShowNewPostPopup] = useState(false);
    const [posts, setPosts] = useState([
        {
            id: 1,
            username: "usuario1",
            profilePic: "https://via.placeholder.com/150/0000FF/808080?Text=DP", // Exemplo de imagem de perfil
            mainImage: "https://via.placeholder.com/500/0000FF/808080?Text=MainImage", // Exemplo de imagem principal
            likes: 120,
            caption: "Aqui vai uma legenda para o post"
        },
        {
            id: 2,
            username: "usuario2",
            profilePic: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=DP", // Exemplo de imagem de perfil
            mainImage: "https://via.placeholder.com/500/FF0000/FFFFFF?Text=MainImage", // Exemplo de imagem principal
            likes: 75,
            caption: "Outra legenda interessante"
        },
        // Adicione mais posts conforme necessário
    ]);

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
                <div className="col-md-9 col-lg-10 feed">
                    <h1>FEED</h1>
                    {posts.map(post => (
                        <Post
                            key={post.id}
                            username={post.username}
                            profilePic={post.profilePic}
                            mainImage={post.mainImage}
                            likes={post.likes}
                            caption={post.caption}
                        />
                    ))}
                    {showSearchPopup && <SearchPopup closePopup={() => setShowSearchPopup(false)} />}
                    {showNewPostPopup && <NewPostPopup closePopup={() => setShowNewPostPopup(false)} />}
                </div>
            </div>
        </div>
    );
}

export default Home;

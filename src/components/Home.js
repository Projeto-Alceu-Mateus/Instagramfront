import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import SearchPopup from './service/SearchPopup';
import NewPostPopup from './service/NewPostPopup';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './assets/css/home.css';
import Post from './post/Post';

function Home() {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showNewPostPopup, setShowNewPostPopup] = useState(false);
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token); // Decodifica o token para obter o nome de usuário logado
    const loggedInUsername = decoded.sub;

    const [posts, setPosts] = useState([]); // Alterado de 'user' para 'posts' para maior clareza

    useEffect(() => {
        axios.get(`http://localhost:8080/user/${loggedInUsername}/feed`)
            .then(response => {
                setPosts(response.data); // Assume que a resposta é um array de postagens
            })
            .catch(error => {
                console.error('Failed to fetch user data:', error);
            });
    }, [loggedInUsername]);
    console.log(posts);
    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
                <div className="col-md-9 col-lg-10 feed">
                    <h1>FEED</h1>
                    <div>
                        {posts.map(post => (
                            <Post key={post.id} post={post} />
                        ))}
                    </div>
                    {showSearchPopup && <SearchPopup closePopup={() => setShowSearchPopup(false)} />}
                    {showNewPostPopup && <NewPostPopup closePopup={() => setShowNewPostPopup(false)} />}
                </div>
            </div>
        </div>
    );
}

export default Home;

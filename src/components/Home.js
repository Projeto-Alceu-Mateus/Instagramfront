import React, { useEffect, useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import SearchPopup from './service/SearchPopup';
import NewPostPopup from './service/NewPostPopup';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './assets/css/home.css';
import Post from './post/Post';
import TopUsersPopup from './TopUsersPopup';

function Home() {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showNewPostPopup, setShowNewPostPopup] = useState(false);
    const [showTopUsersPopup, setShowTopUsersPopup] = useState(true);
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token); 
    const loggedInUsername = decoded.sub;

    const [posts, setPosts] = useState([]); 

    useEffect(() => {
        axios.get(`http://localhost:8080/user/${loggedInUsername}/feed`)
            .then(response => {
                setPosts(response.data); 
            })
            .catch(error => {
                console.error('Failed to fetch user data:', error);
            });
    }, [loggedInUsername]);

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
                    {showTopUsersPopup && <TopUsersPopup closePopup={() => setShowTopUsersPopup(false)} />}
                </div>
            </div>
        </div>
    );
}

export default Home;
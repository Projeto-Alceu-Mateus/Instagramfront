import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

import Sidebar from '../sidebar/Sidebar';
import './UserProfile.css';
import SearchPopup from '../service/SearchPopup';
import NewPostPopup from '../service/NewPostPopup';
import { jwtDecode } from 'jwt-decode';
import ProfilePosts from '../post/ProfilePost';

function UserProfile() {
    const [loading, setLoading] = useState(true);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showNewPostPopup, setShowNewPostPopup] = useState(false);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const { username: targetUsername } = useParams();
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token);
    const loggedInUsername = decoded.sub;

    useEffect(() => {
        setLoading(true);
        const fetchUserData = axios.get(`http://localhost:8080/user/${targetUsername}`);
        const fetchPostsData = axios.get(`http://localhost:8080/user/${targetUsername}/posts`);

        Promise.all([fetchUserData, fetchPostsData])
            .then(([userDataResponse, postsDataResponse]) => {
                setUser(userDataResponse.data);
                setPosts(postsDataResponse.data);
                setIsOwner(decoded.sub === targetUsername);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            });
    }, [targetUsername, decoded.sub]);

    useEffect(() => {
        axios.get(`http://localhost:8080/user/${targetUsername}/isFollowing/${decoded.sub}`)
            .then(response => {
                setIsFollowing(response.data);
            })
            .catch(error => console.error('Failed to fetch follow status:', error));
    }, [targetUsername, decoded.sub]);

    const handleFollowToggle = () => {
        const endpoint = isFollowing ? `/user/${loggedInUsername}/unfollow/${targetUsername}` : `/user/${loggedInUsername}/follow/${targetUsername}`;
        axios.post(`http://localhost:8080${endpoint}`)
            .then(() => {
                setIsFollowing(!isFollowing);
                setUser(prevUser => ({
                    ...prevUser,
                    followersCount: isFollowing ? prevUser.followersCount - 1 : prevUser.followersCount + 1
                }));
            })
            .catch(error => console.error('Error updating follow status:', error));
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" role="status">

                </Spinner>
            </div>
        );
    }
    if (!user) return (
        <Fragment>
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
                    <div className="col-md-8 offset-md-2">
                        <div className="profile-area d-flex align-items-center mt-3 justify-content-between">
                            <h1>Esta página não está disponível.</h1>
                        </div>
                        <h1>  O link em que você clicou pode não estar funcionando, ou a página pode ter sido removida.</h1>
                    </div>
                </div>
            </div>
            {showSearchPopup && <SearchPopup closePopup={() => setShowSearchPopup(false)} />}
            {showNewPostPopup && <NewPostPopup closePopup={() => setShowNewPostPopup(false)} />}
        </Fragment>

    );

    if (loggedInUsername !== targetUsername) return (
        <Fragment>
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
                    <div className="col-md-8 offset-md-2">
                        <div className="profile-area d-flex align-items-center mt-3">
                            <img src={user.profileImage || 'https://via.placeholder.com/150'} alt={`${user.username} profile`} className="profile-image img-fluid rounded-circle" />
                            <div className='name-bio'>
                                <h1 className="profile-name">{user.fullName}</h1>
                                <h1>{user.username}</h1>
                                <p className="profile-bio">{user.bio || "No bio provided."}</p>
                                <p>Seguidores: {user.followersCount} Seguindo: {user.followingCount}</p>
                                <button onClick={handleFollowToggle} className="btn btn-primary">
                                    {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
                                </button>

                                {isOwner && <button className="btn btn-danger">Editar Perfil</button>}
                            </div>
                        </div>
                        <div className="profile-posts">
                            <hr className='bar'/>
                            <ProfilePosts username={targetUsername} />
                        </div>
                    </div>
                </div>
            </div>
            {showSearchPopup && <SearchPopup closePopup={() => setShowSearchPopup(false)} />}
            {showNewPostPopup && <NewPostPopup closePopup={() => setShowNewPostPopup(false)} />}
        </Fragment>
    );
    return (
        <Fragment>
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
                    <div className="col-md-8 offset-md-2">
                        <div className="profile-area d-flex align-items-center mt-3">
                            <img src={user.profileImage || 'https://via.placeholder.com/150'} alt={`${user.username} profile`} className="profile-image img-fluid rounded-circle" />
                            <div className='name-bio'>
                                <h1 className="profile-name">{user.fullName}</h1>
                                <h1>{user.username}</h1>
                                <p className="profile-bio">{user.bio || "No bio provided."}</p>
                                <p>Seguidores: {user.followersCount} Seguindo: {user.followingCount}</p>

                                {isOwner && <button className="btn btn-danger">Editar Perfil</button>}
                            </div>
                        </div>
                        <div className="profile-posts">
                        <hr className='bar'/>
                            {/* Renderização das postagens do usuário */}
                            <ProfilePosts username={loggedInUsername} />
                        </div>
                    </div>
                </div>
            </div>
            {showSearchPopup && <SearchPopup closePopup={() => setShowSearchPopup(false)} />}
            {showNewPostPopup && <NewPostPopup closePopup={() => setShowNewPostPopup(false)} />}
        </Fragment>
    );
}

export default UserProfile;

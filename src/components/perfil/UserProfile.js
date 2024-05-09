import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Sidebar from '../sidebar/Sidebar';
import './UserProfile.css'; // Verifique se os estilos estão corretamente importados
import SearchPopup from '../service/SearchPopup';
import NewPostPopup from '../service/NewPostPopup';
import { jwtDecode } from 'jwt-decode';
function UserProfile() {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showNewPostPopup, setShowNewPostPopup] = useState(false);
    const { username: targetUsername } = useParams();
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token); // Decodifica o token para obter o nome de usuário logado
    const loggedInUsername = decoded.sub;


    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            const decoded = jwtDecode(token); // Use jwtDecode aqui
            setIsOwner(decoded.sub === loggedInUsername);
            console.log(decoded.sub === loggedInUsername);
        }

        axios.get(`http://localhost:8080/user/${username}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch user data:', error);
            });
    }, [loggedInUsername]);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        // Assumindo que 'sub' contém o nome de usuário

        setIsOwner(loggedInUsername === targetUsername);

        axios.get(`http://localhost:8080/user/${targetUsername}/isFollowing/${decoded.sub}`, {
        })
            .then(response => {
                setIsFollowing(response.data);
            })
            .catch(error => console.error('Failed to fetch follow status:', error));
    }, [targetUsername]);


    const handleFollowToggle = () => {
        const token = localStorage.getItem('userToken');
        const decoded = jwtDecode(token); // Decodifica o token para obter o nome de usuário logado
        const loggedInUsername = decoded.sub;
        const endpoint = isFollowing ? `/user/${loggedInUsername}/unfollow/${targetUsername}` : `/user/${loggedInUsername}/follow/${targetUsername}`;
        axios.post(`http://localhost:8080${endpoint}`)
            .then(() => {
                setIsFollowing(!isFollowing); // Atualiza o estado
                // Atualiza o número de seguidores
                setUser(prevUser => {
                    if (isFollowing) {
                        return { ...prevUser, followersCount: prevUser.followersCount - 1 };
                    } else {
                        return { ...prevUser, followersCount: prevUser.followersCount + 1 };
                    }
                });
            })
            .catch(error => console.error('Error updating follow status:', error));
    };
    if (!user) return (
        <Fragment>
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
                    <div className="col-md-8 offset-md-2">
                        <div className="profile-area d-flex align-items-center mt-3 justify-content-between">
                            <h1>error</h1>
                        </div>
                        <div className="profile-posts">
                            <hr />
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
                                <button onClick={handleFollowToggle} className="btn btn-primary">
                                    {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
                                </button>

                                {isOwner && <button className="btn btn-danger">Editar Perfil</button>}
                            </div>
                        </div>
                        <div className="profile-posts">
                            <hr />
                            <h3>Posts</h3>
                            {/* Renderização das postagens do usuário */}
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

import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Sidebar from '../sidebar/Sidebar';
import './UserProfile.css'; // Verifique se os estilos estão corretamente importados
import SearchPopup from '../service/SearchPopup';
import NewPostPopup from '../service/NewPostPopup';

function UserProfile() {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showNewPostPopup, setShowNewPostPopup] = useState(false);
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        // const token = localStorage.getItem('userToken');
        // if (token) {
        //     const decoded = jwt_decode(token);
        //     setIsOwner(decoded.username === username);
        // }

        axios.get(`http://localhost:8080/user/${username}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch user data:', error);
            });
    }, [username]);

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

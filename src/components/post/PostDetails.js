import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

import Sidebar from '../sidebar/Sidebar';
import SearchPopup from '../service/SearchPopup';
import NewPostPopup from '../service/NewPostPopup';
import './PostDetails.css';
import Post from './Post';

function PostDetails() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showNewPostPopup, setShowNewPostPopup] = useState(false);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/p/${postId}`);
                setPost(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch post details:', error);
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [postId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!post) {
        return (
            <Fragment>
                <div className="container-fluid h-100">
                    <div className="row h-100">
                        <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
                        <div className="col-md-8 offset-md-2 text-center">
                            <h1>Este post não está disponível.</h1>
                            <p>O link em que você clicou pode não estar funcionando, ou o post pode ter sido removido.</p>
                        </div>
                    </div>
                </div>
                {showSearchPopup && <SearchPopup closePopup={() => setShowSearchPopup(false)} />}
                {showNewPostPopup && <NewPostPopup closePopup={() => setShowNewPostPopup(false)} />}
            </Fragment>
        );
    }

    return (
        <Fragment>
            <div className="container-fluid h-100">
                <div className="row h-100 feed">
                    <Sidebar setShowSearchPopup={setShowSearchPopup} setShowNewPostPopup={setShowNewPostPopup} />
                    <div className="col-md-9 offset-md-1 d-flex justify-content-center align-items-center post-details-container">
                        <Post post={post} />
                    </div>
                </div>
            </div>
            {showSearchPopup && <SearchPopup closePopup={() => setShowSearchPopup(false)} />}
            {showNewPostPopup && <NewPostPopup closePopup={() => setShowNewPostPopup(false)} />}
        </Fragment>
    );
}

export default PostDetails;

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../assets/css/NewPostPopup.css';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

function NewPostPopup({ closePopup, username }) {
    const [file, setFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token);
    const loggedInUsername = decoded.sub;

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreviewUrl(reader.result);
            setFile(file);
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png' // Aceitar apenas JPEG e PNG
    });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleClosePopup = () => {
        document.body.style.overflow = 'auto';
        closePopup();
    };

    const handleUploadAndCreatePost = async () => {
        if (!file) {
            setAlert({ show: true, message: 'Por favor, selecione um arquivo para fazer upload.', variant: 'danger' });
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const uploadResponse = await axios.post('http://localhost:8080/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const imageUrl = uploadResponse.data;

            const postResponse = await axios.post(`http://localhost:8080/user/${loggedInUsername}/newPost`, {
                imageUrl,
                caption
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (postResponse.status === 200) {
                setAlert({ show: true, message: 'Post criado com sucesso!', variant: 'success' });
            } else {
                setAlert({ show: true, message: 'Erro ao criar o post.', variant: 'danger' });
            }

            setImagePreviewUrl('');
            setCaption('');
            handleClosePopup();
        } catch (error) {
            setAlert({ show: true, message: 'Erro ao criar o post: ' + (error.response?.data || error.message), variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-body" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>Criar nova publicação</h2>
                    <button className="close-btn" onClick={handleClosePopup}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                {alert.show && (
                    <div className={`alert alert-${alert.variant}`} role="alert">
                        {alert.message}
                    </div>
                )}
                {!imagePreviewUrl && (
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        {isDragActive ?
                            <p>Solte a foto aqui...</p> :
                            <p>
                                <FontAwesomeIcon icon={faImage} size="2x" />
                                <br />
                                Arraste as fotos e os vídeos aqui
                            </p>
                        }
                    </div>
                )}
                {imagePreviewUrl && (
                    <>
                        <img src={imagePreviewUrl} alt="Preview" className="preview-image" />
                        <textarea
                            placeholder="Escreva uma legenda..."
                            value={caption}
                            onChange={e => setCaption(e.target.value)}
                        />
                        <button onClick={handleUploadAndCreatePost} className="submit-btn" disabled={loading}>
                            {loading ? 'Carregando...' : 'Compartilhar'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default NewPostPopup;

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../assets/css/NewPostPopup.css';
import { jwtDecode } from 'jwt-decode';

function NewPostPopup({ closePopup, username }) {
    const [file, setFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [message, setMessage] = useState('');
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
        accept: 'image/jpeg, image/png'
    });

    useEffect(() => {
        // Desabilita a rolagem quando o componente é montado
        document.body.style.overflow = 'hidden';
        // Reabilita a rolagem quando o componente é desmontado
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
            setMessage('Por favor, selecione um arquivo para fazer upload.');
            return;
        }

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
            setMessage('Post criado com sucesso!');
            setImagePreviewUrl('');
            setCaption('');
            handleClosePopup();
        } catch (error) {
            setMessage('Erro ao criar o post: ' + (error.response?.data || error.message));
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
                        <button onClick={handleUploadAndCreatePost} className="submit-btn">Compartilhar</button>
                    </>
                )}
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default NewPostPopup;

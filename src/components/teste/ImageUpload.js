import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Pega o primeiro arquivo selecionado
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Por favor, selecione um arquivo para fazer upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:8080/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data);
        } catch (error) {
            setMessage('Falha no upload: ' + error.response.data);
        }
    };

    return (
        <div>
            <h2>Upload de Imagem</h2>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
            <img src={message} alt="Imagem selecionada" />
        </div>
    );
}

export default ImageUpload;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

function EditProfile({ user, onSave, onCancel }) {
    const [usernameInput, setUsernameInput] = useState(user.username);
    const [bioInput, setBioInput] = useState(user.bio || '');
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [imageUploadUrl, setImageUploadUrl] = useState(user.profilePicture);

    useEffect(() => {
        if (usernameInput && usernameInput !== user.username) {
            axios.get(`http://localhost:8080/user/${usernameInput}/verify`)
                .then(response => {
                    setUsernameAvailable(!response.data); // 'true' from server means username exists, so it's not available
                })
                .catch(error => console.error('Failed to check username availability:', error));
        } else {
            setUsernameAvailable(null); // Se for o mesmo username, deve ficar branco (não validação)
        }
    }, [usernameInput, user.username]);

    const handleImageChange = (e) => {
        setNewProfileImage(e.target.files[0]);
    };

    const handleLinkClick = (username) => {
        window.location.href = `/perfil/${username}`; // Isto força o navegador a carregar a página como um novo pedido
    };

    const handleSaveChanges = async () => {
        let updatedImageUrl = imageUploadUrl;

        // Verifica se a imagem foi alterada e faz o upload se necessário
        if (newProfileImage) {
            const formData = new FormData();
            formData.append('image', newProfileImage);
            try {
                const uploadResponse = await axios.post('http://localhost:8080/api/images/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
                updatedImageUrl = uploadResponse.data;
                setImageUploadUrl(updatedImageUrl); // Atualiza a URL da imagem carregada
            } catch (error) {
                console.error('Failed to upload image:', error);
                return;
            }
        }

        // Verifica se algum campo foi alterado
        const isUsernameChanged = usernameInput !== user.username;
        const isBioChanged = bioInput !== user.bio;
        const isImageChanged = updatedImageUrl !== user.profilePicture;

        // Se nada foi alterado, não faz a atualização
        if (!isUsernameChanged && !isBioChanged && !isImageChanged) {
            onCancel();
            return;
        }

        // Cria o objeto de atualização
        const updateData = {
            username: isUsernameChanged ? usernameInput : null,
            bio: isBioChanged ? bioInput : null,
            profilePicture: isImageChanged ? updatedImageUrl : null,
        };

        // Faz a atualização do perfil
        try {
            const response = await axios.put(`http://localhost:8080/user/updateProfile/${user.username}`, updateData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Atualizar o token JWT
            if (response.data.token) {
                localStorage.setItem('userToken', response.data.token);
            }

            onSave(response.data);

            // Redireciona para a nova URL com o novo nome de usuário
            if (isUsernameChanged || isBioChanged || isImageChanged) {
                handleLinkClick(usernameInput);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    return (
        <div className="profile-edit">
            <div className="profile-image-upload">
                <img
                    src={newProfileImage ? URL.createObjectURL(newProfileImage) : user.profilePicture}
                    alt={`${user.username} profile`}
                    className="profile-image img-fluid rounded-circle"
                />
                <label htmlFor="profileImageUpload" className="upload-icon">
                    <FontAwesomeIcon icon={faUpload} />
                </label>
                <input
                    type="file"
                    id="profileImageUpload"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
            </div>
            <div className="name-bio">
                <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className={`form-control ${usernameAvailable === null ? '' : usernameAvailable ? 'is-valid' : 'is-invalid'}`}
                    placeholder="Username"
                />
                <textarea
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="form-control"
                    placeholder="Bio"
                />
                <div className="d-flex">
                    <button className="btn btn-primary tamanhaBtn" onClick={handleSaveChanges}>Salvar</button>
                    <button className="btn btn-secondary tamanhaBtn" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;

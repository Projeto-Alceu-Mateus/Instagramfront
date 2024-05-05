import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
function NewPostPopup({ closePopup }) {
    return (
        <div className="popup new-post-popup">
            <div className="button-container">
                <button className="close-btn" onClick={closePopup}>
                    <FontAwesomeIcon icon={faTimes} /> {/* Usando ícone FontAwesome */}
                </button>
            </div>
            <div className="popup-content">
                <div className="upload-area">
                    <div className="icon"><i className="fa fa-file-upload"></i></div>
                    <h4>Arraste as fotos e os vídeos aqui</h4>
                    <button className="btn-upload">Selecionar do computador</button>
                </div>
            </div>
        </div>
    );
}

export default NewPostPopup;

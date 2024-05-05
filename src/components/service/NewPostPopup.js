import React from 'react';

function NewPostPopup({ closePopup }) {
    return (
        <div className="popup new-post-popup">
            <button className="close-btn" onClick={closePopup}>×</button>
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

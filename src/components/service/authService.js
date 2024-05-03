import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'; // Ajuste conforme necessário

const signup = (userData) => {
    return axios.post(`${API_URL}/register`, userData)
        .then(response => {
            if (response.data.token) {
                localStorage.setItem('userToken', response.data.token);
            }
            return response.data;
        }).catch(error => {
            throw error; // Propague o erro para tratamento adicional
        });
};
const login = (username, password) => {
    return axios.post(`${API_URL}/login`, { username, password })
        .then(response => {
            if (response.data.token) {
                localStorage.setItem('userToken', response.data.token);
            }
            return response.data;
        }).catch(error => {
            if (error.response && error.response.status === 403) {
                console.error('Access Forbidden: ', error.response.data);
            }
            throw error; // Re-lança o erro para tratamento adicional se necessário
        });
};  
export default {
    signup,
    login // certifique-se de que login também esteja definido aqui
};

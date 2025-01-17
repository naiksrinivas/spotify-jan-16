import React from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function Login() {
    const handleLogin = async () => {
        try {
            const response = await axios.get(`${API_URL}/login`);
            window.location.href = response.data.auth_url;
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            <button onClick={handleLogin}>
                Login with Spotify
            </button>
        </div>
    );
}

export default Login; 
import React from 'react';
import axios from 'axios';

function Login() {
    const handleLogin = async () => {
        try {
            const response = await axios.get('http://localhost:5000/login');
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
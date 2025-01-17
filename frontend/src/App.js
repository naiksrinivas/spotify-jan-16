import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import PlaylistList from './components/PlaylistList';
import { SpotifyContext } from './context/SpotifyContext';
import './styles/shared.css';
import { API_URL, BASE_URL } from './config';

console.log('Public URL:', process.env.PUBLIC_URL);
console.log('API URL:', process.env.REACT_APP_API_URL);

function App() {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        // Handle the callback from Spotify
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code && !accessToken) {
            // Clear the URL parameters after getting the code
            window.history.pushState({}, null, BASE_URL);
            
            axios.get(`${API_URL}/callback?code=${code}`)
                .then(response => {
                    setAccessToken(response.data.access_token);
                })
                .catch(error => {
                    console.error('Error getting access token:', error);
                });
        }
    }, [accessToken]);

    return (
        <SpotifyContext.Provider value={{ accessToken }}>
            <div className="App">
                {!accessToken ? (
                    <div className="container">
                        <Login />
                    </div>
                ) : (
                    <PlaylistList />
                )}
            </div>
        </SpotifyContext.Provider>
    );
}

export default App;
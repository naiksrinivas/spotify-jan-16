import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import PlaylistGrid from './components/PlaylistGrid';

function App() {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        // Handle the callback from Spotify
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code && !accessToken) {
            // Clear the URL parameters after getting the code
            window.history.pushState({}, null, '/');
            
            axios.get(`http://localhost:5000/callback?code=${code}`)
                .then(response => {
                    setAccessToken(response.data.access_token);
                })
                .catch(error => {
                    console.error('Error getting access token:', error);
                });
        }
    }, [accessToken]);

    return (
        <div className="App">
            {!accessToken ? (
                <Login />
            ) : (
                <PlaylistGrid accessToken={accessToken} />
            )}
        </div>
    );
}

export default App;
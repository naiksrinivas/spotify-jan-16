import { useState, useEffect } from 'react';
import Playlist from './Playlist';
import { useSpotify } from '../context/SpotifyContext';
import '../styles/PlaylistList.css';

function PlaylistList() {
    const { accessToken } = useSpotify();
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPlaylists = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                setPlaylists(data.items);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylists();
    }, [accessToken]);

    const handlePlaylistClick = (playlist) => {
        setSelectedPlaylist(playlist);
    };

    const handleBackClick = () => {
        setSelectedPlaylist(null);
    };

    if (isLoading) {
        return <div>Loading playlists...</div>;
    }

    return (
        <div>
            {selectedPlaylist ? (
                <Playlist 
                    selectedPlaylist={selectedPlaylist}
                    onBackClick={handleBackClick}
                />
            ) : (
                <div>
                    <h1>Your Playlists</h1>
                    <div className="playlist-grid">
                        {playlists.map(playlist => (
                            <div 
                                key={playlist.id}
                                onClick={() => handlePlaylistClick(playlist)}
                                className="playlist-item"
                            >
                                <img 
                                    src={playlist.images[0]?.url}
                                    alt={playlist.name}
                                />
                                <p>{playlist.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 

export default PlaylistList;
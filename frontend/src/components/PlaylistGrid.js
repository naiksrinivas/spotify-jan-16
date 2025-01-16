import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlaylistGrid.css';

function PlaylistGrid({ accessToken }) {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [trackImages, setTrackImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                setPlaylists(response.data.items);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        if (accessToken) {
            fetchPlaylists();
        }
    }, [accessToken]);

    const fetchAllTracks = async (playlistId) => {
        setLoading(true);
        const tracks = [];
        let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        
        try {
            while (url) {
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                tracks.push(...response.data.items);
                url = response.data.next;
            }

            // Extract unique album images
            const images = [...new Set(
                tracks
                    .filter(track => track.track && track.track.album.images[0])
                    .map(track => track.track.album.images[0].url)
            )];

            setTrackImages(images);
            setSelectedPlaylist(playlistId);
        } catch (error) {
            console.error('Error fetching tracks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate grid dimensions for a square-ish layout
    const calculateGridDimensions = (imageCount) => {
        const cols = Math.ceil(Math.sqrt(imageCount));
        const rows = Math.ceil(imageCount / cols);
        return { cols, rows };
    };

    if (loading) {
        return <div>Loading tracks...</div>;
    }

    if (selectedPlaylist) {
        const { cols } = calculateGridDimensions(trackImages.length);
        return (
            <div>
                <button onClick={() => setSelectedPlaylist(null)}>Back to Playlists</button>
                <div className="image-grid" style={{ 
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gap: '8px'
                }}>
                    {trackImages.map((image, index) => (
                        <img 
                            key={index}
                            src={image}
                            alt={`Album art ${index + 1}`}
                            style={{ width: '100%', aspectRatio: '1' }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="playlist-list">
            {playlists.map(playlist => (
                <div 
                    key={playlist.id} 
                    className="playlist-item"
                    onClick={() => fetchAllTracks(playlist.id)}
                    style={{ cursor: 'pointer' }}
                >
                    <h3>{playlist.name}</h3>
                    <p>{playlist.tracks.total} tracks</p>
                </div>
            ))}
        </div>
    );
}

export default PlaylistGrid; 
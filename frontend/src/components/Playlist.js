import { useState, useEffect } from 'react';
import PlaylistGrid from './PlaylistGrid';
import { useSpotify } from '../context/SpotifyContext';

function Playlist({ selectedPlaylist, onBackClick }) {
    const [trackImages, setTrackImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { accessToken } = useSpotify();

    useEffect(() => {
        const fetchAllTracks = async (playlistId) => {
            setIsLoading(true);
            try {
                let tracks = [];
                let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

                // Keep fetching while there are more tracks
                while (url) {
                    const response = await fetch(url, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    const data = await response.json();
                    
                    tracks = [...tracks, ...data.items];
                    url = data.next;
                }

                // Extract unique album art URLs using Set
                const uniqueImages = new Set(
                    tracks
                        .map(item => item.track?.album?.images[0]?.url)
                        .filter(url => url != null)
                );

                setTrackImages([...uniqueImages]); // Convert Set back to array
            } catch (error) {
                console.error('Error fetching tracks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedPlaylist?.id) {
            fetchAllTracks(selectedPlaylist.id);
        }
    }, [selectedPlaylist, accessToken]);

    return (
        <div>
            <button onClick={onBackClick}>Back to Playlists</button>
            <h2>{selectedPlaylist?.name}</h2>
            <PlaylistGrid images={trackImages} isLoading={isLoading} />
        </div>
    );
}

export default Playlist;
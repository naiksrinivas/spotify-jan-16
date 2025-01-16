import { createContext, useContext } from 'react';

export const SpotifyContext = createContext(null);

export function useSpotify() {
    return useContext(SpotifyContext);
} 
// KAPTEN KARAOKE - Local Storage Hook
import { useState, useCallback, useEffect } from 'react';
import type { UserPreferences } from '@/types';

const STORAGE_KEYS = {
  FAVORITES: 'kapten_karaoke_favorites',
  LAST_PLAYED: 'kapten_karaoke_last_played',
  PLAYBACK_POSITION: 'kapten_karaoke_position',
  VOLUME: 'kapten_karaoke_volume',
  PLAYBACK_RATE: 'kapten_karaoke_rate',
  USER_PREFERENCES: 'kapten_karaoke_preferences',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  favorites: [],
  volume: 0.7,
  playbackRate: 1,
};

export function useLocalStorage() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      } else {
        // Migrate from old storage keys
        const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
        const volume = parseFloat(localStorage.getItem(STORAGE_KEYS.VOLUME) || '0.7');
        const playbackRate = parseFloat(localStorage.getItem(STORAGE_KEYS.PLAYBACK_RATE) || '1');
        
        setPreferences({
          favorites,
          volume,
          playbackRate,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      try {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
      return updated;
    });
  }, []);

  // Favorites management
  const addToFavorites = useCallback((songId: string) => {
    setPreferences(prev => {
      if (prev.favorites.includes(songId)) return prev;
      
      const updated = {
        ...prev,
        favorites: [...prev.favorites, songId],
      };
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromFavorites = useCallback((songId: string) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        favorites: prev.favorites.filter(id => id !== songId),
      };
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((songId: string) => {
    return preferences.favorites.includes(songId);
  }, [preferences.favorites]);

  const toggleFavorite = useCallback((songId: string) => {
    if (isFavorite(songId)) {
      removeFromFavorites(songId);
    } else {
      addToFavorites(songId);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  // Last played song
  const saveLastPlayed = useCallback((songId: string, position: number = 0) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_PLAYED, songId);
      localStorage.setItem(STORAGE_KEYS.PLAYBACK_POSITION, position.toString());
      savePreferences({ lastPlayedSongId: songId, lastPlaybackPosition: position });
    } catch (error) {
      console.error('Error saving last played:', error);
    }
  }, [savePreferences]);

  const getLastPlayed = useCallback(() => {
    try {
      const songId = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
      const position = parseFloat(localStorage.getItem(STORAGE_KEYS.PLAYBACK_POSITION) || '0');
      return { songId, position };
    } catch {
      return { songId: null, position: 0 };
    }
  }, []);

  // Volume
  const saveVolume = useCallback((volume: number) => {
    savePreferences({ volume });
  }, [savePreferences]);

  // Playback rate
  const savePlaybackRate = useCallback((rate: number) => {
    savePreferences({ playbackRate: rate });
  }, [savePreferences]);

  return {
    preferences,
    isLoaded,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    saveLastPlayed,
    getLastPlayed,
    saveVolume,
    savePlaybackRate,
    savePreferences,
  };
}

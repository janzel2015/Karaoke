// KAPTEN KARAOKE - Type Definitions

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  minusOneUrl?: string;
  videoUrl?: string;
  lyricsUrl?: string;
  genre?: string;
  year?: number;
}

export interface LyricLine {
  time: number;
  text: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  songs: Song[];
  createdAt?: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isMinusOne: boolean;
  isKaraokeMode: boolean;
  isVideoMode: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
}

export interface QueueState {
  songs: Song[];
  currentIndex: number;
  originalOrder: Song[];
  isShuffled?: boolean;
}

export interface UserPreferences {
  lastPlayedSongId?: string;
  lastPlaybackPosition?: number;
  favorites: string[];
  volume: number;
  playbackRate: number;
}

export interface GitHubSource {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

export type ViewMode = 'home' | 'search' | 'library' | 'playlist' | 'karaoke' | 'video';

export interface AudioAnalyzerData {
  frequencyData: Uint8Array;
  timeData: Uint8Array;
}

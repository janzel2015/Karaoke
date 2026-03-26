// KAPTEN KARAOKE - Main Application
import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { MusicPlayer } from '@/components/MusicPlayer';
import { KaraokeMode } from '@/components/KaraokeMode';
import { VideoPlayer } from '@/components/VideoPlayer';
import { QueuePanel } from '@/components/QueuePanel';
import { HomeView } from '@/sections/HomeView';
import { SearchView } from '@/sections/SearchView';
import { LibraryView } from '@/sections/LibraryView';
import { PlaylistView } from '@/sections/PlaylistView';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useLyrics } from '@/hooks/useLyrics';
import { useGitHubLoader } from '@/hooks/useGitHubLoader';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { Song, Playlist, ViewMode } from '@/types';
import './App.css';

function App() {
  // State
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Custom hooks
  const {
    songs,
    playlists,
    isLoading: isLoadingSongs,
    error: loadError,
    githubSource,
    updateGitHubSource,
  } = useGitHubLoader();

  const {
    preferences,
    isLoaded: preferencesLoaded,
    toggleFavorite,
    isFavorite,
    saveLastPlayed,
    saveVolume,
  } = useLocalStorage();

  const {
    audioRef,
    // analyserRef,
    playerState,
    queue,
    currentSong,
    togglePlay,
    playSong,
    seekTo,
    setVolume,
    toggleMute,
    toggleMinusOne,
    toggleKaraokeMode,
    toggleVideoMode,
    toggleRepeatMode,
    toggleShuffle,
    nextSong,
    prevSong,
  } = useAudioPlayer();

  const {
    lyrics,
    currentLineIndex,
    // isLoading: isLoadingLyrics,
    loadLyrics,
    updateCurrentTime,
    clearLyrics,
  } = useLyrics();

  // Update lyrics current time
  useEffect(() => {
    updateCurrentTime(playerState.currentTime);
  }, [playerState.currentTime, updateCurrentTime]);

  // Load lyrics when song changes
  useEffect(() => {
    if (currentSong?.lyricsUrl) {
      loadLyrics(currentSong.lyricsUrl);
    } else {
      clearLyrics();
    }
  }, [currentSong, loadLyrics, clearLyrics]);

  // Save last played song
  useEffect(() => {
    if (currentSong) {
      saveLastPlayed(currentSong.id, playerState.currentTime);
    }
  }, [currentSong?.id, playerState.currentTime, saveLastPlayed]);

  // Restore last played on mount
  useEffect(() => {
    if (preferencesLoaded && preferences.lastPlayedSongId && songs.length > 0) {
      const lastSong = songs.find(s => s.id === preferences.lastPlayedSongId);
      if (lastSong) {
        playSong(lastSong);
        if (preferences.lastPlaybackPosition) {
          seekTo(preferences.lastPlaybackPosition);
        }
      }
    }
  }, [preferencesLoaded, songs.length]);

  // Set initial volume from preferences
  useEffect(() => {
    if (preferencesLoaded) {
      setVolume(preferences.volume);
    }
  }, [preferencesLoaded, preferences.volume, setVolume]);

  // App ready state
  useEffect(() => {
    if (preferencesLoaded && !isLoadingSongs) {
      setAppReady(true);
      if (loadError) {
        toast.error(loadError);
      }
    }
  }, [preferencesLoaded, isLoadingSongs, loadError]);

  // Handle play song
  const handlePlaySong = useCallback((song: Song, songQueue?: Song[]) => {
    playSong(song, songQueue || songs);
    toast.success(`Playing: ${song.title}`, {
      description: song.artist,
      duration: 2000,
    });
  }, [playSong, songs]);

  // Handle toggle favorite
  const handleToggleFavorite = useCallback((songId: string) => {
    toggleFavorite(songId);
    const isNowFavorite = !isFavorite(songId);
    toast.success(isNowFavorite ? 'Added to favorites' : 'Removed from favorites', {
      duration: 2000,
    });
  }, [toggleFavorite, isFavorite]);

  // Handle select playlist
  const handleSelectPlaylist = useCallback((playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentView('playlist');
  }, []);

  // Handle back from playlist
  const handleBackFromPlaylist = useCallback(() => {
    setSelectedPlaylist(null);
    setCurrentView('library');
  }, []);

  // Handle shuffle play
  const handleShufflePlay = useCallback(() => {
    if (selectedPlaylist?.songs.length || songs.length) {
      const playlist = selectedPlaylist?.songs || songs;
      const shuffled = [...playlist].sort(() => Math.random() - 0.5);
      playSong(shuffled[0]!, shuffled);
      toggleShuffle();
      toast.success('Shuffle play started');
    }
  }, [selectedPlaylist, songs, playSong, toggleShuffle]);

  // Handle queue song selection
  const handleQueueSelect = useCallback((index: number) => {
    if (queue.songs[index]) {
      playSong(queue.songs[index], queue.songs);
    }
  }, [queue.songs, playSong]);

  // Handle remove from queue
  const handleRemoveFromQueue = useCallback((_index: number) => {
    // This would need to be implemented in the audio player hook
    toast.info('Feature coming soon');
  }, []);

  // Handle clear queue
  const handleClearQueue = useCallback(() => {
    // This would need to be implemented in the audio player hook
    toast.info('Feature coming soon');
  }, []);

  // Handle clear favorites
  const handleClearFavorites = useCallback(() => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      preferences.favorites.forEach(id => toggleFavorite(id));
      toast.success('Favorites cleared');
    }
  }, [preferences.favorites, toggleFavorite]);

  // Handle video time update
  const handleVideoTimeUpdate = useCallback((time: number) => {
    seekTo(time);
  }, [seekTo]);

  // Handle video play state change
  const handleVideoPlayStateChange = useCallback((isPlaying: boolean) => {
    if (isPlaying !== playerState.isPlaying) {
      togglePlay();
    }
  }, [playerState.isPlaying, togglePlay]);

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            songs={songs}
            playlists={playlists}
            currentSong={currentSong}
            isPlaying={playerState.isPlaying}
            favorites={preferences.favorites}
            onPlaySong={handlePlaySong}
            onToggleFavorite={handleToggleFavorite}
            onSelectPlaylist={handleSelectPlaylist}
          />
        );

      case 'search':
        return (
          <SearchView
            songs={songs}
            currentSong={currentSong}
            isPlaying={playerState.isPlaying}
            favorites={preferences.favorites}
            onPlaySong={handlePlaySong}
            onToggleFavorite={handleToggleFavorite}
          />
        );

      case 'library':
        return (
          <LibraryView
            songs={songs}
            playlists={playlists}
            currentSong={currentSong}
            isPlaying={playerState.isPlaying}
            favorites={preferences.favorites}
            onPlaySong={handlePlaySong}
            onToggleFavorite={handleToggleFavorite}
            onSelectPlaylist={handleSelectPlaylist}
            onClearFavorites={handleClearFavorites}
          />
        );

      case 'playlist':
        return (
          <PlaylistView
            playlist={selectedPlaylist}
            songs={songs}
            currentSong={currentSong}
            isPlaying={playerState.isPlaying}
            favorites={preferences.favorites}
            onPlaySong={handlePlaySong}
            onToggleFavorite={handleToggleFavorite}
            onBack={handleBackFromPlaylist}
            onShufflePlay={handleShufflePlay}
          />
        );

      default:
        return null;
    }
  };

  // Loading state
  if (!appReady) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-black">K</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">KAPTEN KARAOKE</h1>
          <p className="text-gray-400">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex">
      {/* Audio Element */}
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Sidebar (desktop) */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        playlistCount={playlists.length}
        favoriteCount={preferences.favorites.length}
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-32 md:pb-24">
        <div className="max-w-screen-xl mx-auto p-4 md:p-8">
          {renderView()}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav currentView={currentView} onViewChange={setCurrentView} />

      {/* Music Player */}
      <MusicPlayer
        currentSong={currentSong}
        playerState={playerState}
        queueLength={queue.songs.length}
        isFavorite={currentSong ? isFavorite(currentSong.id) : false}
        onTogglePlay={togglePlay}
        onNext={nextSong}
        onPrev={prevSong}
        onSeek={seekTo}
        onVolumeChange={(v) => {
          setVolume(v);
          saveVolume(v);
        }}
        onToggleMute={toggleMute}
        onToggleRepeat={toggleRepeatMode}
        onToggleShuffle={toggleShuffle}
        onToggleMinusOne={toggleMinusOne}
        onToggleKaraoke={toggleKaraokeMode}
        onToggleVideo={toggleVideoMode}
        onToggleFavorite={() => currentSong && handleToggleFavorite(currentSong.id)}
        onExpand={() => {}}
        onShowQueue={() => setIsQueueOpen(true)}
      />

      {/* Karaoke Mode */}
      {playerState.isKaraokeMode && currentSong && (
        <KaraokeMode
          song={currentSong}
          lyrics={lyrics}
          currentLineIndex={currentLineIndex}
          currentTime={playerState.currentTime}
          isPlaying={playerState.isPlaying}
          onClose={toggleKaraokeMode}
        />
      )}

      {/* Video Player */}
      {playerState.isVideoMode && currentSong?.videoUrl && (
        <VideoPlayer
          videoUrl={currentSong.videoUrl}
          isPlaying={playerState.isPlaying}
          currentTime={playerState.currentTime}
          onTimeUpdate={handleVideoTimeUpdate}
          onPlayStateChange={handleVideoPlayStateChange}
          onClose={toggleVideoMode}
        />
      )}

      {/* Queue Panel */}
      <QueuePanel
        queue={queue.songs}
        currentIndex={queue.currentIndex}
        currentSong={currentSong}
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        onSelectSong={handleQueueSelect}
        onRemoveSong={handleRemoveFromQueue}
        onClearQueue={handleClearQueue}
      />

      {/* Toast notifications */}
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#282828',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />

      {/* GitHub Source Config (hidden by default, can be shown via settings) */}
      {false && (
        <div className="fixed top-4 right-4 bg-[#282828] p-4 rounded-lg z-50">
          <h3 className="font-bold text-white mb-2">GitHub Source</h3>
          <input
            type="text"
            placeholder="Owner"
            value={githubSource.owner}
            onChange={(e) => updateGitHubSource({ owner: e.target.value })}
            className="w-full mb-2 px-3 py-2 bg-black rounded text-white text-sm"
          />
          <input
            type="text"
            placeholder="Repo"
            value={githubSource.repo}
            onChange={(e) => updateGitHubSource({ repo: e.target.value })}
            className="w-full mb-2 px-3 py-2 bg-black rounded text-white text-sm"
          />
          <input
            type="text"
            placeholder="Branch"
            value={githubSource.branch}
            onChange={(e) => updateGitHubSource({ branch: e.target.value })}
            className="w-full px-3 py-2 bg-black rounded text-white text-sm"
          />
        </div>
      )}
    </div>
  );
}

export default App;

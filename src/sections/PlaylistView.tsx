// KAPTEN KARAOKE - Playlist View
import { useMemo } from 'react';
// import { SongCard } from '@/components/SongCard';
import { Play, Shuffle, Heart, ArrowLeft, Clock } from 'lucide-react';
import type { Song, Playlist } from '@/types';

interface PlaylistViewProps {
  playlist: Playlist | null;
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  favorites: string[];
  onPlaySong: (song: Song, queue?: Song[]) => void;
  onToggleFavorite: (songId: string) => void;
  onBack: () => void;
  onShufflePlay: () => void;
}

export function PlaylistView({
  playlist,
  songs,
  currentSong,
  isPlaying,
  favorites,
  onPlaySong,
  onToggleFavorite,
  onBack,
  onShufflePlay,
}: PlaylistViewProps) {
  // Get playlist songs or use all songs if no playlist selected
  const playlistSongs = useMemo(() => {
    if (playlist) {
      return playlist.songs;
    }
    // If no playlist, show favorites
    return songs.filter((s) => favorites.includes(s.id));
  }, [playlist, songs, favorites]);

  const totalDuration = useMemo(() => {
    return playlistSongs.reduce((acc, song) => acc + song.duration, 0);
  }, [playlistSongs]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  if (!playlist && favorites.length === 0) {
    return (
      <div className="space-y-6 pb-32">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Heart className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No playlist selected
          </h3>
          <p className="text-gray-400">
            Select a playlist from your library
          </p>
        </div>
      </div>
    );
  }

  const title = playlist?.name || 'Liked Songs';
  const description = playlist?.description || 
    (playlist ? `Playlist • ${playlist.songs.length} songs` : `Playlist • ${favorites.length} songs`);
  const coverUrl = playlist?.coverUrl || playlistSongs[0]?.coverUrl;

  return (
    <div className="space-y-6 pb-32">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cover */}
        <div className="w-full md:w-52 aspect-square md:aspect-auto md:h-52 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Heart className="w-20 h-20 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-end">
          <span className="text-sm text-gray-400 uppercase tracking-wider mb-2">
            Playlist
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-gray-400 mb-2">{description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{playlistSongs.length} songs</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(totalDuration)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => playlistSongs[0] && onPlaySong(playlistSongs[0], playlistSongs)}
          disabled={playlistSongs.length === 0}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <Play className="w-7 h-7 text-black ml-1" fill="currentColor" />
        </button>

        <button
          onClick={onShufflePlay}
          disabled={playlistSongs.length === 0}
          className="w-12 h-12 rounded-full border border-gray-600 hover:border-white flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={() => {}}
          className="w-12 h-12 rounded-full border border-gray-600 hover:border-white flex items-center justify-center transition-colors"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Songs List */}
      {playlistSongs.length > 0 ? (
        <div className="space-y-2">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-white/10">
            <span className="w-8">#</span>
            <span>Title</span>
            <span className="w-24 text-right">Features</span>
            <span className="w-16 text-right">Duration</span>
          </div>

          {/* Song rows */}
          <div className="space-y-1">
            {playlistSongs.map((song, index) => (
              <div
                key={song.id}
                className={`
                  group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 rounded-lg
                  transition-colors cursor-pointer
                  ${currentSong?.id === song.id ? 'bg-white/10' : 'hover:bg-white/5'}
                `}
                onClick={() => onPlaySong(song, playlistSongs)}
              >
                {/* Number/Play */}
                <div className="w-8 flex items-center justify-center">
                  {currentSong?.id === song.id && isPlaying ? (
                    <div className="flex gap-0.5 items-end h-4">
                      <span className="w-1 bg-green-400 animate-pulse" style={{ height: '60%' }} />
                      <span className="w-1 bg-green-400 animate-pulse" style={{ height: '100%', animationDelay: '0.1s' }} />
                      <span className="w-1 bg-green-400 animate-pulse" style={{ height: '40%', animationDelay: '0.2s' }} />
                    </div>
                  ) : (
                    <span className="text-gray-500 group-hover:hidden">{index + 1}</span>
                  )}
                  <Play className="w-4 h-4 text-white hidden group-hover:block" />
                </div>

                {/* Title & Artist */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/images/default-cover.jpg';
                    }}
                  />
                  <div className="min-w-0">
                    <p className={`font-medium truncate ${currentSong?.id === song.id ? 'text-green-400' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  </div>
                </div>

                {/* Features - desktop only */}
                <div className="hidden md:flex items-center justify-end gap-2 w-24">
                  {song.lyricsUrl && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                      K
                    </span>
                  )}
                  {song.videoUrl && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                      V
                    </span>
                  )}
                  {song.minusOneUrl && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                      M
                    </span>
                  )}
                </div>

                {/* Duration & Actions */}
                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(song.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart
                      className={`w-5 h-5 ${favorites.includes(song.id) ? 'fill-green-400 text-green-400' : 'text-gray-400'}`}
                    />
                  </button>
                  <span className="text-sm text-gray-500 w-12 text-right">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400">No songs in this playlist</p>
        </div>
      )}
    </div>
  );
}

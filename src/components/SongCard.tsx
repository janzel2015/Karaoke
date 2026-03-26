// KAPTEN KARAOKE - Song Card Component
import { Play, Pause, Heart, MoreVertical, Mic2, Video } from 'lucide-react';
import { useState } from 'react';
import type { Song } from '@/types';

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  isCurrentSong: boolean;
  isFavorite: boolean;
  onPlay: () => void;
  onToggleFavorite: () => void;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'list';
}

export function SongCard({
  song,
  isPlaying,
  isCurrentSong,
  isFavorite,
  onPlay,
  onToggleFavorite,
  onClick,
  variant = 'default',
}: SongCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Default cover image
  const coverUrl = imageError || !song.coverUrl 
    ? 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/images/default-cover.jpg'
    : song.coverUrl;

  if (variant === 'list') {
    return (
      <div
        onClick={onClick}
        className={`
          group flex items-center gap-3 p-3 rounded-lg
          transition-all duration-200 cursor-pointer
          ${isCurrentSong ? 'bg-white/10' : 'hover:bg-white/5'}
        `}
      >
        {/* Play button / Number */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="w-10 h-10 flex items-center justify-center"
        >
          {isCurrentSong && isPlaying ? (
            <div className="flex gap-0.5 items-end h-4">
              <span className="w-1 bg-green-400 animate-pulse" style={{ height: '60%' }} />
              <span className="w-1 bg-green-400 animate-pulse" style={{ height: '100%', animationDelay: '0.1s' }} />
              <span className="w-1 bg-green-400 animate-pulse" style={{ height: '40%', animationDelay: '0.2s' }} />
            </div>
          ) : (
            <Play className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100" />
          )}
        </button>

        {/* Cover */}
        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
          <img
            src={coverUrl}
            alt={song.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {isCurrentSong && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${isCurrentSong ? 'text-green-400' : 'text-white'}`}>
            {song.title}
          </h4>
          <p className="text-sm text-gray-400 truncate">{song.artist}</p>
        </div>

        {/* Features indicators */}
        <div className="flex items-center gap-2">
          {song.lyricsUrl && (
            <Mic2 className="w-4 h-4 text-gray-500" />
          )}
          {song.videoUrl && (
            <Video className="w-4 h-4 text-gray-500" />
          )}
        </div>

        {/* Duration */}
        <span className="text-sm text-gray-500 w-12 text-right">
          {formatDuration(song.duration)}
        </span>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? 'fill-green-400 text-green-400' : 'text-gray-400'}`}
          />
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
      >
        <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
          <img
            src={coverUrl}
            alt={song.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className={`
              absolute inset-0 bg-black/60 flex items-center justify-center
              transition-opacity duration-200
              ${isCurrentSong && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `}
          >
            {isCurrentSong && isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate">{song.title}</h4>
          <p className="text-sm text-gray-400 truncate">{song.artist}</p>
        </div>
      </div>
    );
  }

  // Default card view
  return (
    <div className="group relative">
      <div
        onClick={onClick}
        className={`
          song-card bg-[#181818] rounded-lg p-4 cursor-pointer
          ${isCurrentSong ? 'ring-2 ring-green-500/50' : ''}
        `}
      >
        {/* Cover Image */}
        <div className="relative aspect-square rounded-md overflow-hidden mb-4">
          <img
            src={coverUrl}
            alt={song.title}
            className={`
              w-full h-full object-cover
              ${isCurrentSong && isPlaying ? 'album-spin' : ''}
            `}
            onError={() => setImageError(true)}
            loading="lazy"
          />
          
          {/* Play Overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className={`
              absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500
              flex items-center justify-center shadow-lg
              transform transition-all duration-300
              ${isCurrentSong ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
              hover:scale-105 hover:bg-green-400
            `}
          >
            {isCurrentSong && isPlaying ? (
              <Pause className="w-6 h-6 text-black" />
            ) : (
              <Play className="w-6 h-6 text-black ml-1" />
            )}
          </button>

          {/* Feature badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {song.lyricsUrl && (
              <span className="px-2 py-1 bg-black/70 rounded text-[10px] font-medium text-green-400">
                KARAOKE
              </span>
            )}
            {song.videoUrl && (
              <span className="px-2 py-1 bg-black/70 rounded text-[10px] font-medium text-blue-400">
                MTV
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <h3 className="font-semibold text-white truncate mb-1">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
        
        {song.album && (
          <p className="text-xs text-gray-500 truncate mt-1">{song.album}</p>
        )}
      </div>

      {/* Context menu */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MoreVertical className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}

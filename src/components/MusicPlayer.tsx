// KAPTEN KARAOKE - Music Player Component
import { useState, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  Mic2,
  Minus,
  Video,
  Maximize2,
  ChevronUp,
  Heart,
  ListMusic,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { Song, PlayerState } from '@/types';

interface MusicPlayerProps {
  currentSong: Song | null;
  playerState: PlayerState;
  queueLength: number;
  isFavorite: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onToggleMinusOne: () => void;
  onToggleKaraoke: () => void;
  onToggleVideo: () => void;
  onToggleFavorite: () => void;
  onExpand: () => void;
  onShowQueue: () => void;
}

export function MusicPlayer({
  currentSong,
  playerState,
  // queueLength,
  isFavorite,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleRepeat,
  onToggleShuffle,
  onToggleMinusOne,
  onToggleKaraoke,
  onToggleVideo,
  onToggleFavorite,
  onExpand,
  onShowQueue,
}: MusicPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !playerState.duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(percent * playerState.duration);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    onExpand();
  };

  // Default cover
  const coverUrl = imageError || !currentSong?.coverUrl
    ? 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/images/default-cover.jpg'
    : currentSong.coverUrl;

  // Expanded full-screen player
  if (isExpanded && currentSong) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#1a1a2e] via-[#121212] to-[#0a0a0a] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 safe-top">
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <span className="text-sm text-gray-400 uppercase tracking-wider">
            Now Playing
          </span>
          <button
            onClick={onShowQueue}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ListMusic className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-4">
          {/* Album Art */}
          <div className="relative w-full max-w-sm aspect-square mb-8">
            <img
              src={coverUrl}
              alt={currentSong.title}
              className={`
                w-full h-full object-cover rounded-2xl shadow-2xl
                ${playerState.isPlaying ? 'album-spin' : ''}
              `}
              onError={() => setImageError(true)}
            />
            
            {/* Feature badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {playerState.isMinusOne && (
                <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-bold text-black">
                  MINUS ONE
                </span>
              )}
              {playerState.isKaraokeMode && (
                <span className="px-3 py-1 bg-purple-500 rounded-full text-xs font-bold text-white">
                  KARAOKE
                </span>
              )}
            </div>
          </div>

          {/* Song Info */}
          <div className="w-full max-w-sm mb-8">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{currentSong.title}</h2>
                <p className="text-lg text-gray-400">{currentSong.artist}</p>
              </div>
              <button
                onClick={onToggleFavorite}
                className="p-3 rounded-full hover:bg-white/10 transition-colors"
              >
                <Heart
                  className={`w-7 h-7 ${isFavorite ? 'fill-green-400 text-green-400' : 'text-gray-400'}`}
                />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full max-w-sm mb-6">
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="h-1 bg-gray-600 rounded-full cursor-pointer group"
            >
              <div
                className="h-full bg-white rounded-full relative group-hover:bg-green-400 transition-colors"
                style={{ width: `${(playerState.currentTime / playerState.duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{formatTime(playerState.currentTime)}</span>
              <span>{formatTime(playerState.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <button
              onClick={onToggleShuffle}
              className={`p-3 rounded-full transition-colors ${playerState.isShuffled ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
            >
              <Shuffle className="w-6 h-6" />
            </button>

            <button
              onClick={onPrev}
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <SkipBack className="w-8 h-8" fill="currentColor" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              {playerState.isPlaying ? (
                <Pause className="w-10 h-10 text-black" fill="currentColor" />
              ) : (
                <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-8 h-8" fill="currentColor" />
            </button>

            <button
              onClick={onToggleRepeat}
              className={`p-3 rounded-full transition-colors ${playerState.repeatMode !== 'none' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
            >
              {playerState.repeatMode === 'one' ? (
                <Repeat1 className="w-6 h-6" />
              ) : (
                <Repeat className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Feature Toggles */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onToggleMinusOne}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200
                ${playerState.isMinusOne 
                  ? 'bg-green-500 text-black' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }
              `}
            >
              <Minus className="w-4 h-4" />
              Minus One
            </button>

            {currentSong.lyricsUrl && (
              <button
                onClick={onToggleKaraoke}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${playerState.isKaraokeMode 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }
                `}
              >
                <Mic2 className="w-4 h-4" />
                Karaoke
              </button>
            )}

            {currentSong.videoUrl && (
              <button
                onClick={onToggleVideo}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${playerState.isVideoMode 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }
                `}
              >
                <Video className="w-4 h-4" />
                MTV
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Compact player (bottom bar)
  return (
    <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] md:bottom-0 left-0 right-0 z-40">
      {/* Progress bar */}
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        className="h-1 bg-gray-700 cursor-pointer group"
      >
        <div
          className="h-full bg-white group-hover:bg-green-400 transition-colors relative"
          style={{ width: `${playerState.duration ? (playerState.currentTime / playerState.duration) * 100 : 0}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Player bar */}
      <div className="bg-[#181818] border-t border-white/5 px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {currentSong ? (
              <>
                <div 
                  className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={handleExpand}
                >
                  <img
                    src={coverUrl}
                    alt={currentSong.title}
                    className={`w-full h-full object-cover ${playerState.isPlaying ? 'album-spin' : ''}`}
                    onError={() => setImageError(true)}
                  />
                </div>
                <div className="min-w-0 cursor-pointer" onClick={handleExpand}>
                  <h4 className="font-medium text-white truncate hover:underline">
                    {currentSong.title}
                  </h4>
                  <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
                </div>
                <button
                  onClick={onToggleFavorite}
                  className="p-2 ml-2 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? 'fill-green-400 text-green-400' : 'text-gray-400'}`}
                  />
                </button>
              </>
            ) : (
              <div className="text-gray-400 text-sm">No song playing</div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-1">
            <button
              onClick={onToggleShuffle}
              className={`p-2 rounded-full transition-colors hidden sm:block ${playerState.isShuffled ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={onPrev}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              disabled={!currentSong}
            >
              <SkipBack className="w-5 h-5" fill="currentColor" />
            </button>

            <button
              onClick={onTogglePlay}
              disabled={!currentSong}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
            >
              {playerState.isPlaying ? (
                <Pause className="w-5 h-5 md:w-6 md:h-6 text-black" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 md:w-6 md:h-6 text-black ml-0." fill="currentColor" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              disabled={!currentSong}
            >
              <SkipForward className="w-5 h-5" fill="currentColor" />
            </button>

            <button
              onClick={onToggleRepeat}
              className={`p-2 rounded-full transition-colors hidden sm:block ${playerState.repeatMode !== 'none' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
            >
              {playerState.repeatMode === 'one' ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Extra Controls */}
          <div className="flex items-center justify-end gap-2 flex-1">
            {/* Feature toggles - desktop only */}
            <div className="hidden md:flex items-center gap-2">
              {currentSong?.lyricsUrl && (
                <button
                  onClick={onToggleKaraoke}
                  className={`p-2 rounded-full transition-colors ${playerState.isKaraokeMode ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
                  title="Karaoke Mode"
                >
                  <Mic2 className="w-5 h-5" />
                </button>
              )}

              {currentSong?.videoUrl && (
                <button
                  onClick={onToggleVideo}
                  className={`p-2 rounded-full transition-colors ${playerState.isVideoMode ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                  title="Video Mode"
                >
                  <Video className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={onToggleMinusOne}
                className={`p-2 rounded-full transition-colors ${playerState.isMinusOne ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                title="Minus One"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>

            {/* Volume */}
            <div 
              className="relative hidden sm:block"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <button
                onClick={onToggleMute}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {playerState.isMuted || playerState.volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {showVolume && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-[#282828] rounded-lg shadow-xl">
                  <Slider
                    value={[playerState.isMuted ? 0 : playerState.volume * 100]}
                    onValueChange={([v]) => onVolumeChange(v / 100)}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                </div>
              )}
            </div>

            {/* Expand button */}
            <button
              onClick={handleExpand}
              className="p-2 rounded-full hover:bg-white/10 transition-colors hidden md:flex"
            >
              <Maximize2 className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

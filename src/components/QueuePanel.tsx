// KAPTEN KARAOKE - Queue Panel Component
import { X, GripVertical, Trash2, ListMusic } from 'lucide-react';
import type { Song } from '@/types';

interface QueuePanelProps {
  queue: Song[];
  currentIndex: number;
  currentSong: Song | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSong: (index: number) => void;
  onRemoveSong: (index: number) => void;
  onClearQueue: () => void;
}

export function QueuePanel({
  queue,
  currentIndex,
  currentSong,
  isOpen,
  onClose,
  onSelectSong,
  onRemoveSong,
  onClearQueue,
}: QueuePanelProps) {
  if (!isOpen) return null;

  const upcomingSongs = queue.slice(currentIndex + 1);
  const previousSongs = queue.slice(0, currentIndex);

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-[#121212] border-l border-white/10 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ListMusic className="w-6 h-6 text-green-400" />
          <div>
            <h2 className="font-bold text-white">Queue</h2>
            <p className="text-xs text-gray-400">
              {upcomingSongs.length} upcoming • {previousSongs.length} played
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearQueue}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Clear queue"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Now Playing */}
        {currentSong && (
          <div>
            <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
              Now Playing
            </h3>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-12 h-12 rounded object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/images/default-cover.jpg';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{currentSong.title}</p>
                <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
              </div>
              <div className="flex gap-0.5 items-end h-4">
                <span className="w-1 bg-green-400 animate-pulse" style={{ height: '60%' }} />
                <span className="w-1 bg-green-400 animate-pulse" style={{ height: '100%', animationDelay: '0.1s' }} />
                <span className="w-1 bg-green-400 animate-pulse" style={{ height: '40%', animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        {/* Next Up */}
        {upcomingSongs.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Next Up
            </h3>
            <div className="space-y-1">
              {upcomingSongs.map((song, idx) => {
                const actualIndex = currentIndex + 1 + idx;
                return (
                  <div
                    key={`${song.id}-${actualIndex}`}
                    className="group flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <GripVertical className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 cursor-grab" />
                    
                    <span className="text-sm text-gray-500 w-6 text-center">
                      {actualIndex + 1}
                    </span>
                    
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover cursor-pointer"
                      onClick={() => onSelectSong(actualIndex)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/images/default-cover.jpg';
                      }}
                    />
                    
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onSelectSong(actualIndex)}
                    >
                      <p className="text-sm font-medium text-white truncate">{song.title}</p>
                      <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                    </div>
                    
                    <button
                      onClick={() => onRemoveSong(actualIndex)}
                      className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Previously Played */}
        {previousSongs.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Previously Played
            </h3>
            <div className="space-y-1 opacity-50">
              {previousSongs.map((song, idx) => (
                <div
                  key={`${song.id}-prev-${idx}`}
                  className="flex items-center gap-2 p-2"
                >
                  <span className="text-sm text-gray-500 w-6 text-center">
                    {idx + 1}
                  </span>
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/kaptenkaraoke/media/main/images/default-cover.jpg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{song.title}</p>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {upcomingSongs.length === 0 && previousSongs.length === 0 && !currentSong && (
          <div className="text-center py-12">
            <ListMusic className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Your queue is empty</p>
            <p className="text-sm text-gray-500 mt-1">
              Add songs to start playing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

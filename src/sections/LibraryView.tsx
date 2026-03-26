// KAPTEN KARAOKE - Library View
import { useState, useMemo } from 'react';
import { SongCard } from '@/components/SongCard';
import { Heart, Clock, Music, Mic2, Video, Trash2 } from 'lucide-react';
import type { Song, Playlist } from '@/types';

interface LibraryViewProps {
  songs: Song[];
  playlists: Playlist[];
  currentSong: Song | null;
  isPlaying: boolean;
  favorites: string[];
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onClearFavorites: () => void;
}

type LibraryTab = 'favorites' | 'recent' | 'karaoke' | 'videos' | 'playlists';

export function LibraryView({
  songs,
  playlists,
  currentSong,
  isPlaying,
  favorites,
  onPlaySong,
  onToggleFavorite,
  onSelectPlaylist,
  onClearFavorites,
}: LibraryViewProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>('favorites');

  // Get favorite songs
  const favoriteSongs = useMemo(
    () => songs.filter((s) => favorites.includes(s.id)),
    [songs, favorites]
  );

  // Get karaoke songs
  const karaokeSongs = useMemo(
    () => songs.filter((s) => s.lyricsUrl),
    [songs]
  );

  // Get video songs
  const videoSongs = useMemo(
    () => songs.filter((s) => s.videoUrl),
    [songs]
  );

  // Get recently played (simulate with reversed songs for now)
  const recentSongs = useMemo(() => [...songs].reverse().slice(0, 20), [songs]);

  const tabs = [
    { id: 'favorites' as LibraryTab, label: 'Liked Songs', icon: Heart, count: favoriteSongs.length },
    { id: 'recent' as LibraryTab, label: 'Recently Played', icon: Clock, count: recentSongs.length },
    { id: 'karaoke' as LibraryTab, label: 'Karaoke', icon: Mic2, count: karaokeSongs.length },
    { id: 'videos' as LibraryTab, label: 'Videos', icon: Video, count: videoSongs.length },
    { id: 'playlists' as LibraryTab, label: 'Playlists', icon: Music, count: playlists.length },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'favorites':
        return (
          <div className="space-y-4">
            {favoriteSongs.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">{favoriteSongs.length} songs</p>
                  <button
                    onClick={onClearFavorites}
                    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {favoriteSongs.map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      isPlaying={isPlaying}
                      isCurrentSong={currentSong?.id === song.id}
                      isFavorite={true}
                      onPlay={() => onPlaySong(song)}
                      onToggleFavorite={() => onToggleFavorite(song.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Songs you like will appear here
                </h3>
                <p className="text-gray-400">
                  Save songs by clicking the heart icon
                </p>
              </div>
            )}
          </div>
        );

      case 'recent':
        return (
          <div className="space-y-4">
            {recentSongs.length > 0 ? (
              <>
                <p className="text-gray-400">{recentSongs.length} songs</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recentSongs.map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      isPlaying={isPlaying}
                      isCurrentSong={currentSong?.id === song.id}
                      isFavorite={favorites.includes(song.id)}
                      onPlay={() => onPlaySong(song)}
                      onToggleFavorite={() => onToggleFavorite(song.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-400">No recently played songs</p>
              </div>
            )}
          </div>
        );

      case 'karaoke':
        return (
          <div className="space-y-4">
            {karaokeSongs.length > 0 ? (
              <>
                <p className="text-gray-400">{karaokeSongs.length} karaoke-ready songs</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {karaokeSongs.map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      isPlaying={isPlaying}
                      isCurrentSong={currentSong?.id === song.id}
                      isFavorite={favorites.includes(song.id)}
                      onPlay={() => onPlaySong(song)}
                      onToggleFavorite={() => onToggleFavorite(song.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Mic2 className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No karaoke songs yet
                </h3>
                <p className="text-gray-400">
                  Add .lrc files to your repository for synced lyrics
                </p>
              </div>
            )}
          </div>
        );

      case 'videos':
        return (
          <div className="space-y-4">
            {videoSongs.length > 0 ? (
              <>
                <p className="text-gray-400">{videoSongs.length} videos</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {videoSongs.map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      isPlaying={isPlaying}
                      isCurrentSong={currentSong?.id === song.id}
                      isFavorite={favorites.includes(song.id)}
                      onPlay={() => onPlaySong(song)}
                      onToggleFavorite={() => onToggleFavorite(song.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Video className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No videos yet
                </h3>
                <p className="text-gray-400">
                  Add .mp4 files to your repository for MTV mode
                </p>
              </div>
            )}
          </div>
        );

      case 'playlists':
        return (
          <div className="space-y-4">
            {playlists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => onSelectPlaylist(playlist)}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                  >
                    <div className="w-20 h-20 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      {playlist.coverUrl ? (
                        <img
                          src={playlist.coverUrl}
                          alt={playlist.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Music className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-lg truncate">
                        {playlist.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {playlist.songs.length} songs
                      </p>
                      {playlist.description && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {playlist.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Music className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No playlists yet
                </h3>
                <p className="text-gray-400">
                  Create playlists in your repository with playlists.json
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
          <Heart className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Your Library</h1>
          <p className="text-gray-400">
            {favoriteSongs.length} liked songs • {playlists.length} playlists
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className="text-xs opacity-60">({tab.count})</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}

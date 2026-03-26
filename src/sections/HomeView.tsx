// KAPTEN KARAOKE - Home View
import { useMemo } from 'react';
import { SongCard } from '@/components/SongCard';
import { Mic2, Video, Clock, TrendingUp } from 'lucide-react';
import type { Song, Playlist } from '@/types';

interface HomeViewProps {
  songs: Song[];
  playlists: Playlist[];
  currentSong: Song | null;
  isPlaying: boolean;
  favorites: string[];
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
}

export function HomeView({
  songs,
  playlists,
  currentSong,
  isPlaying,
  favorites,
  onPlaySong,
  onToggleFavorite,
  onSelectPlaylist,
}: HomeViewProps) {
  // Get featured songs (first 6)
  const featuredSongs = useMemo(() => songs.slice(0, 6), [songs]);

  // Get songs with karaoke
  const karaokeSongs = useMemo(
    () => songs.filter(s => s.lyricsUrl).slice(0, 6),
    [songs]
  );

  // Get songs with videos
  const videoSongs = useMemo(
    () => songs.filter(s => s.videoUrl).slice(0, 6),
    [songs]
  );

  // Get recently added (last 6)
  const recentSongs = useMemo(() => songs.slice(-6).reverse(), [songs]);

  return (
    <div className="space-y-8 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 via-green-800 to-black p-6 md:p-10">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Welcome to <span className="text-green-400">KAPTEN KARAOKE</span>
          </h1>
          <p className="text-lg text-gray-300 mb-6 max-w-xl">
            Sing along with synced lyrics, switch to minus-one mode, and enjoy MTV videos. 
            All loaded from GitHub RAW.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => featuredSongs[0] && onPlaySong(featuredSongs[0])}
              className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Start Playing
            </button>
            
            {karaokeSongs[0] && (
              <button
                onClick={() => onPlaySong(karaokeSongs[0])}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-colors flex items-center gap-2"
              >
                <Mic2 className="w-5 h-5" />
                Try Karaoke
              </button>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
      </section>

      {/* Featured Songs */}
      {featuredSongs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">Featured Songs</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Show all
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredSongs.map((song) => (
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
        </section>
      )}

      {/* Karaoke Ready */}
      {karaokeSongs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mic2 className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl md:text-2xl font-bold text-white">Karaoke Ready</h2>
            </div>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Show all
            </button>
          </div>
          
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
        </section>
      )}

      {/* MTV Videos */}
      {videoSongs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl md:text-2xl font-bold text-white">MTV Videos</h2>
            </div>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Show all
            </button>
          </div>
          
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
        </section>
      )}

      {/* Recently Added */}
      {recentSongs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              <h2 className="text-xl md:text-2xl font-bold text-white">Recently Added</h2>
            </div>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Show all
            </button>
          </div>
          
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
        </section>
      )}

      {/* Playlists */}
      {playlists.length > 0 && (
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Your Playlists</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => onSelectPlaylist(playlist)}
                className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
              >
                <div className="w-16 h-16 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  {playlist.coverUrl ? (
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {playlist.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
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
        </section>
      )}
    </div>
  );
}

// KAPTEN KARAOKE - Search View
import { useState, useMemo } from 'react';
import { SearchBar, SearchFilters } from '@/components/SearchBar';
import { SongCard } from '@/components/SongCard';
import { Mic2, Video, Music, User, Disc } from 'lucide-react';
import type { Song } from '@/types';

interface SearchViewProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  favorites: string[];
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
}

export function SearchView({
  songs,
  currentSong,
  isPlaying,
  favorites,
  onPlaySong,
  onToggleFavorite,
}: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter songs based on search query and filter
  const filteredSongs = useMemo(() => {
    let result = songs;

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.album?.toLowerCase().includes(query) ||
          song.genre?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'karaoke':
        result = result.filter((s) => s.lyricsUrl);
        break;
      case 'videos':
        result = result.filter((s) => s.videoUrl);
        break;
      case 'minusone':
        result = result.filter((s) => s.minusOneUrl);
        break;
    }

    return result;
  }, [songs, searchQuery, selectedFilter]);

  // Get unique artists
  const artists = useMemo(() => {
    const artistMap = new Map<string, Song[]>();
    filteredSongs.forEach((song) => {
      if (!artistMap.has(song.artist)) {
        artistMap.set(song.artist, []);
      }
      artistMap.get(song.artist)!.push(song);
    });
    return Array.from(artistMap.entries()).slice(0, 6);
  }, [filteredSongs]);

  // Get unique albums
  const albums = useMemo(() => {
    const albumMap = new Map<string, Song[]>();
    filteredSongs.forEach((song) => {
      if (song.album) {
        if (!albumMap.has(song.album)) {
          albumMap.set(song.album, []);
        }
        albumMap.get(song.album)!.push(song);
      }
    });
    return Array.from(albumMap.entries()).slice(0, 6);
  }, [filteredSongs]);

  return (
    <div className="space-y-6 pb-32">
      {/* Search Header */}
      <div className="sticky top-0 z-20 bg-[#121212]/95 backdrop-blur-md py-4 -mx-4 px-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="What do you want to sing?"
          autoFocus
        />
        
        <div className="mt-4">
          <SearchFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() ? (
        <div className="space-y-8">
          {/* Songs */}
          {filteredSongs.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-bold text-white">
                  Songs ({filteredSongs.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredSongs.map((song) => (
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

          {/* Artists */}
          {artists.length > 0 && selectedFilter === 'all' && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Artists</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {artists.map(([artist, artistSongs]) => (
                  <button
                    key={artist}
                    className="flex flex-col items-center p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-3">
                      {artistSongs[0]?.coverUrl ? (
                        <img
                          src={artistSongs[0].coverUrl}
                          alt={artist}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-white text-center truncate w-full">
                      {artist}
                    </span>
                    <span className="text-sm text-gray-400">
                      {artistSongs.length} songs
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Albums */}
          {albums.length > 0 && selectedFilter === 'all' && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Disc className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Albums</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {albums.map(([album, albumSongs]) => (
                  <button
                    key={album}
                    className="flex flex-col p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-3 overflow-hidden">
                      {albumSongs[0]?.coverUrl ? (
                        <img
                          src={albumSongs[0].coverUrl}
                          alt={album}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Disc className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-white truncate">{album}</span>
                    <span className="text-sm text-gray-400 truncate">
                      {albumSongs[0]?.artist}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {filteredSongs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <Music className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      ) : (
        // Browse Categories (when no search)
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-white">Browse All</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Karaoke Category */}
            <button
              onClick={() => setSelectedFilter('karaoke')}
              className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 p-4 text-left hover:scale-[1.02] transition-transform"
            >
              <Mic2 className="w-8 h-8 text-white mb-2" />
              <span className="text-lg font-bold text-white">Karaoke</span>
              <span className="absolute bottom-2 right-2 text-4xl font-bold text-white/20">
                {songs.filter(s => s.lyricsUrl).length}
              </span>
            </button>

            {/* Videos Category */}
            <button
              onClick={() => setSelectedFilter('videos')}
              className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 p-4 text-left hover:scale-[1.02] transition-transform"
            >
              <Video className="w-8 h-8 text-white mb-2" />
              <span className="text-lg font-bold text-white">MTV Videos</span>
              <span className="absolute bottom-2 right-2 text-4xl font-bold text-white/20">
                {songs.filter(s => s.videoUrl).length}
              </span>
            </button>

            {/* Minus One Category */}
            <button
              onClick={() => setSelectedFilter('minusone')}
              className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600 p-4 text-left hover:scale-[1.02] transition-transform"
            >
              <Music className="w-8 h-8 text-white mb-2" />
              <span className="text-lg font-bold text-white">Minus One</span>
              <span className="absolute bottom-2 right-2 text-4xl font-bold text-white/20">
                {songs.filter(s => s.minusOneUrl).length}
              </span>
            </button>

            {/* All Songs */}
            <button
              onClick={() => setSelectedFilter('all')}
              className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-orange-600 to-red-600 p-4 text-left hover:scale-[1.02] transition-transform"
            >
              <Disc className="w-8 h-8 text-white mb-2" />
              <span className="text-lg font-bold text-white">All Songs</span>
              <span className="absolute bottom-2 right-2 text-4xl font-bold text-white/20">
                {songs.length}
              </span>
            </button>
          </div>

          {/* Recent Searches (placeholder) */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Popular Songs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {songs.slice(0, 6).map((song) => (
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
        </div>
      )}
    </div>
  );
}

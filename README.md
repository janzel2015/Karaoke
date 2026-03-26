# KAPTEN KARAOKE

A Spotify-like karaoke web application with GitHub RAW media loading, optimized for mobile-first design and ready for Vercel deployment.

![KAPTEN KARAOKE](https://raw.githubusercontent.com/kaptenkaraoke/media/main/images/banner.png)

## Features

### Core Features
- **Spotify-like UI** - Dark mode, glassmorphism, modern design
- **Mobile-first responsive design** - Bottom navigation for mobile, sidebar for desktop
- **GitHub RAW auto-loader** - Automatically loads songs from GitHub repository
- **Karaoke Mode** - Synced lyrics display with LRC format support
- **Minus One Feature** - Vocal reduction using audio processing
- **MTV Video Mode** - MP4 video playback with sync
- **Playlist System** - Create and manage playlists
- **Search & Filter** - Real-time search by title, artist, album
- **Local Storage** - Saves favorites, playback position, volume

### Player Features
- Play/Pause, Next/Previous
- Repeat (none/all/one)
- Shuffle
- Volume control
- Playback speed control
- Progress bar with seek
- Queue management
- Audio visualizer

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks
- **Audio Processing**: Web Audio API
- **Storage**: LocalStorage
- **Deployment**: Vercel-ready

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd kapten-karaoke
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

### 3. Build for Production

```bash
npm run build
```

### 4. Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repo to Vercel for auto-deployment.

## GitHub Repository Structure

Create a GitHub repository with this structure:

```
your-repo/
├── songs/
│   ├── song1.mp3              # Original audio
│   ├── song1-minus.mp3        # Minus one version (optional)
│   ├── song2.mp3
│   └── ...
├── videos/
│   ├── song1.mp4              # MTV video (optional)
│   └── ...
├── lyrics/
│   ├── song1.lrc              # Synced lyrics (optional)
│   └── ...
├── images/
│   ├── song1.jpg              # Album art (optional)
│   └── default-cover.jpg      # Default cover image
└── playlists.json             # Playlist definitions (optional)
```

### LRC Lyrics Format

```
[00:00.00] Song Title
[00:05.00] First line of lyrics
[00:10.00] Second line of lyrics
[00:15.00] Third line of lyrics
```

### playlists.json Format

```json
{
  "playlists": [
    {
      "id": "playlist-1",
      "name": "My Favorites",
      "description": "Best karaoke songs",
      "coverUrl": "https://raw.githubusercontent.com/.../cover.jpg",
      "songs": [
        {
          "id": "song1",
          "title": "Song Title",
          "artist": "Artist Name",
          "duration": 180,
          "coverUrl": "...",
          "audioUrl": "...",
          "minusOneUrl": "...",
          "videoUrl": "...",
          "lyricsUrl": "..."
        }
      ]
    }
  ]
}
```

## Configuration

### Default GitHub Source

The app uses these defaults:
- **Owner**: `kaptenkaraoke`
- **Repo**: `media`
- **Branch**: `main`

To use your own repository, modify `src/hooks/useGitHubLoader.ts`:

```typescript
const DEFAULT_GITHUB_SOURCE = {
  owner: 'your-github-username',
  repo: 'your-repo-name',
  branch: 'main',
};
```

Or implement a settings UI to allow users to configure their own source.

## File Naming Convention

For automatic song detection, use these naming patterns:

| File Type | Pattern | Example |
|-----------|---------|---------|
| Audio | `{song-name}.mp3` | `never-gonna-give-you-up.mp3` |
| Minus One | `{song-name}-minus.mp3` | `never-gonna-give-you-up-minus.mp3` |
| Video | `{song-name}.mp4` | `never-gonna-give-you-up.mp4` |
| Lyrics | `{song-name}.lrc` | `never-gonna-give-you-up.lrc` |
| Cover | `{song-name}.jpg` | `never-gonna-give-you-up.jpg` |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `→` | Next song |
| `←` | Previous song |
| `↑` | Volume up |
| `↓` | Volume down |
| `M` | Toggle mute |
| `K` | Toggle karaoke mode |
| `V` | Toggle video mode |
| `F` | Fullscreen (video) |
| `ESC` | Close modal/exit fullscreen |

## Mobile Gestures

- **Tap** - Play/Pause
- **Swipe left** - Next song
- **Swipe right** - Previous song
- **Long press** - Add to queue

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 14+
- iOS Safari 14+
- Chrome Android 80+

## CORS Configuration

GitHub RAW URLs support CORS by default. No additional configuration needed.

## Performance Tips

1. **Optimize audio files** - Use 128-192kbps MP3 for faster loading
2. **Compress images** - Use WebP or compressed JPG for album art
3. **Lazy loading** - The app automatically lazy-loads images
4. **Caching** - Browser caches GitHub RAW files

## Troubleshooting

### Songs not loading
- Check GitHub repository is public
- Verify file paths are correct
- Check browser console for CORS errors

### Lyrics not syncing
- Verify LRC format is correct
- Check timestamps are in `[mm:ss.xx]` format
- Ensure lyrics file is UTF-8 encoded

### Video not playing
- Check video format is MP4 (H.264)
- Verify video URL is accessible
- Check browser supports the codec

### Audio processing not working
- Ensure browser supports Web Audio API
- Check audio file is not corrupted
- Try refreshing the page

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Sidebar.tsx
│   ├── MobileNav.tsx
│   ├── SongCard.tsx
│   ├── MusicPlayer.tsx
│   ├── KaraokeMode.tsx
│   ├── VideoPlayer.tsx
│   ├── QueuePanel.tsx
│   ├── SearchBar.tsx
│   └── AudioVisualizer.tsx
├── sections/           # Page sections
│   ├── HomeView.tsx
│   ├── SearchView.tsx
│   ├── LibraryView.tsx
│   └── PlaylistView.tsx
├── hooks/              # Custom React hooks
│   ├── useAudioPlayer.ts
│   ├── useLyrics.ts
│   ├── useGitHubLoader.ts
│   └── useLocalStorage.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx
├── App.css
└── index.css
```

### Adding New Features

1. Create component in `src/components/`
2. Add types to `src/types/index.ts`
3. Create hook in `src/hooks/` if needed
4. Integrate in `App.tsx`

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

- UI inspired by Spotify
- Icons from Lucide React
- Components from shadcn/ui

## Support

For issues and feature requests, please open an issue on GitHub.

---

**Enjoy singing with KAPTEN KARAOKE!** 🎤🎵

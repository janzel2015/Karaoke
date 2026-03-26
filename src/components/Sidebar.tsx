// KAPTEN KARAOKE - Sidebar Component
import { Home, Search, Library, Heart, Settings, Music, Disc } from 'lucide-react';
import type { ViewMode } from '@/types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  playlistCount: number;
  favoriteCount: number;
}

const navItems = [
  { id: 'home' as ViewMode, label: 'Home', icon: Home },
  { id: 'search' as ViewMode, label: 'Search', icon: Search },
  { id: 'library' as ViewMode, label: 'Your Library', icon: Library },
];

export function Sidebar({ currentView, onViewChange, playlistCount, favoriteCount }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-black fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
          <Disc className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">KAPTEN</h1>
          <p className="text-xs text-green-400 font-medium">KARAOKE</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium
                transition-all duration-200 group
                ${isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mx-6 my-4 h-px bg-white/10" />

      {/* Library Section */}
      <div className="px-6 py-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Your Collection
        </h3>
        
        <div className="space-y-1">
          <button
            onClick={() => onViewChange('playlist')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <span className="block">Playlists</span>
            </div>
            <span className="text-xs text-gray-500">{playlistCount}</span>
          </button>

          <button
            onClick={() => onViewChange('library')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <span className="block">Liked Songs</span>
            </div>
            <span className="text-xs text-gray-500">{favoriteCount}</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-6">
        <button className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        
        <div className="mt-4 text-xs text-gray-600">
          <p>v1.0.0 • GitHub RAW Loader</p>
        </div>
      </div>
    </aside>
  );
}

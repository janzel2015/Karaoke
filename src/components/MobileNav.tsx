// KAPTEN KARAOKE - Mobile Bottom Navigation
import { Home, Search, Library, Heart } from 'lucide-react';
import type { ViewMode } from '@/types';

interface MobileNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const navItems = [
  { id: 'home' as ViewMode, label: 'Home', icon: Home },
  { id: 'search' as ViewMode, label: 'Search', icon: Search },
  { id: 'library' as ViewMode, label: 'Library', icon: Library },
  { id: 'playlist' as ViewMode, label: 'Liked', icon: Heart },
];

export function MobileNav({ currentView, onViewChange }: MobileNavProps) {
  return (
    <nav className="mobile-nav md:hidden glass border-t border-white/5">
      <div className="flex items-center justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                flex flex-col items-center gap-1 py-2 px-4 rounded-lg
                transition-all duration-200 min-w-[64px]
                ${isActive 
                  ? 'text-green-400' 
                  : 'text-gray-400'
                }
              `}
            >
              <Icon 
                className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

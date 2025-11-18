import React from 'react';
import { Activity, User, MessageSquare, Info, Menu, X } from 'lucide-react';
import { ViewState } from '../App';

interface NavbarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'news', label: 'Live Pulse', icon: <Activity size={18} /> },
    { id: 'player', label: 'Player Search', icon: <User size={18} /> },
    { id: 'chat', label: 'Analyst Bot', icon: <MessageSquare size={18} /> },
    { id: 'about', label: 'About', icon: <Info size={18} /> },
  ];

  return (
    <nav className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer hover:text-emerald-200 transition-colors"
            onClick={() => onViewChange('news')}
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-emerald-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m16 12-4-4-4 4"/>
                <path d="M12 16V8"/>
              </svg>
            </div>
            CricAI Pulse
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium
                  ${currentView === item.id 
                    ? 'bg-emerald-800 text-white shadow-inner' 
                    : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-emerald-800 text-emerald-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-900 border-t border-emerald-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-md text-base font-medium
                  ${currentView === item.id 
                    ? 'bg-emerald-800 text-white' 
                    : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
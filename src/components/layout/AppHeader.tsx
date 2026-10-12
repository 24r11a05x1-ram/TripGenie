import React from 'react';
import { Sparkles, MapPin, Plus, Compass, FolderKanban, Menu, X } from 'lucide-react';

interface AppHeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenCreateTrip: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenCreateTrip,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors">
                Trip<span className="text-emerald-600">Genie</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ml-2 border border-emerald-200/60">
                AI Travel Planner
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentTab === 'dashboard'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('my-trips')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'my-trips'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>My Trips</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentTab === 'explore'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>
          </nav>

          {/* Actions & User Badge */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenCreateTrip}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Plan New Trip</span>
            </button>

            {/* User Pill / Demo indicator */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden ring-2 ring-emerald-500/20">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-stone-900 leading-none">Alex Rivera</p>
                <span className="text-[10px] font-semibold text-emerald-600">Demo Account</span>
              </div>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenCreateTrip}
              className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <button
            type="button"
            onClick={() => {
              onNavigate('dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate('my-trips');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            My Trips
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate('explore');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            Explore Destinations
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenCreateTrip();
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl text-center"
          >
            + Create New Trip
          </button>
        </div>
      )}
    </header>
  );
};

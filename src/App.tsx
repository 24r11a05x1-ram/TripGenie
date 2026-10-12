import React, { useState, useEffect } from 'react';
import { CompleteTrip } from './types/trip';
import { DEMO_GOA_TRIP } from './data/demoTrip';
import { getSavedTrips, saveTrip, duplicateTrip, deleteTrip, getSharedTrip } from './services/tripService';
import { AppHeader } from './components/layout/AppHeader';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ExplorePage } from './pages/ExplorePage';
import { SharedTripPage } from './pages/SharedTripPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'create' | 'itinerary' | 'my-trips' | 'explore' | 'shared'>('landing');
  const [savedTrips, setSavedTrips] = useState<CompleteTrip[]>([]);
  const [activeTrip, setActiveTrip] = useState<CompleteTrip>(DEMO_GOA_TRIP);
  const [initialDestination, setInitialDestination] = useState<string>('Goa, India');

  // Load saved trips on mount
  useEffect(() => {
    const loaded = getSavedTrips();
    setSavedTrips(loaded);

    // Check URL hash for shared trip
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#shared-trip/')) {
        const shareId = hash.replace('#shared-trip/', '');
        const shared = getSharedTrip(shareId);
        if (shared) {
          setActiveTrip(shared);
          setCurrentTab('shared');
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Handlers
  const handleOpenTrip = (trip: CompleteTrip) => {
    setActiveTrip(trip);
    setCurrentTab('itinerary');
  };

  const handleOpenCreateTrip = (dest?: string) => {
    if (dest) {
      setInitialDestination(dest);
    }
    setCurrentTab('create');
  };

  const handleTripGenerated = (trip: CompleteTrip) => {
    // Save to local collection
    const saved = saveTrip(trip);
    setSavedTrips(getSavedTrips());
    setActiveTrip(saved);
    setCurrentTab('itinerary');
  };

  const handleUpdateActiveTrip = (updated: CompleteTrip) => {
    setActiveTrip(updated);
    saveTrip(updated);
    setSavedTrips(getSavedTrips());
  };

  const handleDuplicateTrip = (trip: CompleteTrip) => {
    duplicateTrip(trip);
    setSavedTrips(getSavedTrips());
  };

  const handleDeleteTrip = (tripId: string) => {
    deleteTrip(tripId);
    setSavedTrips(getSavedTrips());
    if (activeTrip?.id === tripId) {
      setActiveTrip(DEMO_GOA_TRIP);
    }
  };

  const handleExploreDemo = () => {
    setActiveTrip(DEMO_GOA_TRIP);
    setCurrentTab('itinerary');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <AppHeader
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab as any)}
        onOpenCreateTrip={() => handleOpenCreateTrip()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onPlanTrip={() => handleOpenCreateTrip()}
            onExploreDemo={handleExploreDemo}
            onSelectQuickDestination={(dest) => handleOpenCreateTrip(dest)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            savedTrips={savedTrips}
            onOpenTrip={handleOpenTrip}
            onOpenCreateTrip={() => handleOpenCreateTrip()}
            onDuplicateTrip={handleDuplicateTrip}
            onDeleteTrip={handleDeleteTrip}
            onExploreDemo={handleExploreDemo}
          />
        )}

        {currentTab === 'create' && (
          <CreateTripPage
            initialDestination={initialDestination}
            onTripGenerated={handleTripGenerated}
            onCancel={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'itinerary' && (
          <ItineraryPage
            trip={activeTrip}
            onUpdateTrip={handleUpdateActiveTrip}
            onBackToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'my-trips' && (
          <MyTripsPage
            savedTrips={savedTrips}
            onOpenTrip={handleOpenTrip}
            onOpenCreateTrip={() => handleOpenCreateTrip()}
            onDuplicateTrip={handleDuplicateTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        )}

        {currentTab === 'explore' && (
          <ExplorePage
            onSelectDestination={(dest) => handleOpenCreateTrip(dest)}
          />
        )}

        {currentTab === 'shared' && (
          <SharedTripPage
            trip={activeTrip}
            onCustomizeTrip={(trip) => {
              const cloned = duplicateTrip(trip);
              setActiveTrip(cloned);
              setSavedTrips(getSavedTrips());
              setCurrentTab('itinerary');
            }}
          />
        )}
      </main>

      {/* Global Footer (no-print) */}
      <footer className="bg-white border-t border-stone-200/80 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-900 text-sm">Trip<span className="text-emerald-600">Genie</span></span>
            <span>•</span>
            <span>Plan smarter. Travel better.</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>Verified GPS Coordinates</span>
            <span>•</span>
            <span>Interactive Leaflet Maps</span>
            <span>•</span>
            <span>Route Optimization</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Bookmark, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Check, 
  RefreshCw, 
  Plus, 
  Info,
  Navigation,
  Clock,
  Layers
} from 'lucide-react';
import { CompleteTrip, Activity, Restaurant, DailyItinerary } from '../types/trip';
import { DaySelector } from '../components/itinerary/DaySelector';
import { ItineraryTimeline } from '../components/itinerary/ItineraryTimeline';
import { MapView } from '../components/map/MapView';
import { LocationDetailsPanel } from '../components/itinerary/LocationDetailsPanel';
import { BudgetBreakdown } from '../components/budget/BudgetBreakdown';
import { AiModificationPanel } from '../components/ai/AiModificationPanel';
import { ShareTripModal } from '../components/trip/ShareTripModal';
import { exportItineraryToPDF } from '../services/pdfService';
import { saveTrip } from '../services/tripService';
import { formatDistance, formatDuration } from '../services/routeService';

interface ItineraryPageProps {
  trip: CompleteTrip;
  onUpdateTrip: (trip: CompleteTrip) => void;
  onBackToDashboard: () => void;
}

export const ItineraryPage: React.FC<ItineraryPageProps> = ({
  trip,
  onUpdateTrip,
  onBackToDashboard,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>(1);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [inspectedItem, setInspectedItem] = useState<Activity | Restaurant | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isModifying, setIsModifying] = useState(false);
  const [lastChanges, setLastChanges] = useState<string[]>([]);
  const [lastMessage, setLastMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'budget'>('timeline');

  // Compute total distance & transit duration across all days
  const totalStats = React.useMemo(() => {
    let totalDist = 0;
    let totalDur = 0;
    trip.days.forEach((d) => {
      if (d.dayRouteSummary) {
        totalDist += d.dayRouteSummary.distanceKm;
        totalDur += d.dayRouteSummary.durationMin;
      }
    });
    return {
      distanceKm: Number(totalDist.toFixed(1)),
      durationMin: totalDur,
    };
  }, [trip.days]);

  // Handle Save Trip
  const handleSaveTrip = () => {
    saveTrip(trip);
    setIsSaved(true);
  };

  // Handle AI Modification
  const handleModify = async (promptText: string) => {
    setIsModifying(true);
    try {
      const response = await fetch('/api/modify-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip,
          modificationPrompt: promptText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to modify itinerary');
      }

      const data = await response.json();
      onUpdateTrip(data.updatedTrip);
      setLastChanges(data.changesSummary || []);
      setLastMessage(data.message || 'Itinerary updated!');
      setIsSaved(false);
    } catch (err: any) {
      console.error('Error modifying itinerary:', err);
    } finally {
      setIsModifying(false);
    }
  };

  // Move activity up / down
  const handleMoveActivity = (dayNumber: number, fromIdx: number, toIdx: number) => {
    if (toIdx < 0) return;
    const updated = JSON.parse(JSON.stringify(trip)) as CompleteTrip;
    const targetDay = updated.days.find((d) => d.dayNumber === dayNumber);
    if (!targetDay || toIdx >= targetDay.activities.length) return;

    const [moved] = targetDay.activities.splice(fromIdx, 1);
    targetDay.activities.splice(toIdx, 0, moved);

    // Re-sequence
    targetDay.activities.forEach((act, idx) => {
      act.sequenceOrder = idx + 1;
    });

    onUpdateTrip(updated);
    setIsSaved(false);
  };

  // Remove activity
  const handleRemoveActivity = (dayNumber: number, activityId: string) => {
    const updated = JSON.parse(JSON.stringify(trip)) as CompleteTrip;
    const targetDay = updated.days.find((d) => d.dayNumber === dayNumber);
    if (!targetDay) return;

    targetDay.activities = targetDay.activities.filter((a) => a.id !== activityId);
    targetDay.activities.forEach((act, idx) => {
      act.sequenceOrder = idx + 1;
    });

    onUpdateTrip(updated);
    setIsSaved(false);
  };

  // Replace activity
  const handleReplaceActivity = (activity: Activity) => {
    handleModify(`Replace ${activity.name} on Day ${activity.dayNumber} with an exciting alternative nearby attraction.`);
  };

  // Add activity prompt
  const handleAddActivity = (dayNumber: number) => {
    const customPrompt = window.prompt(`What type of activity would you like to add to Day ${dayNumber}? (e.g. "Sunset viewpoint", "Heritage church", "Water sports")`, 'Sunset viewpoint');
    if (customPrompt) {
      handleModify(`Add ${customPrompt} to Day ${dayNumber} matching the travel style and geography.`);
    }
  };

  // Optimize Budget Trigger
  const handleOptimizeBudget = async () => {
    await handleModify('Reduce total trip expenses with practical budget optimizations, affordable thalis, and lower-cost activities.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveTrip}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isSaved
                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved to Trips' : 'Save Changes'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Share2 className="w-4 h-4 text-stone-500" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={() => exportItineraryToPDF(trip)}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Trip Overview Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {trip.summary.totalDays} Days / {trip.summary.totalNights} Nights
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {trip.preferences.startDate} to {trip.preferences.endDate}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
              {trip.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              {trip.summary.overview}
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-right shrink-0">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Estimated Total Budget
            </span>
            <div className="flex items-center gap-1 text-2xl font-black text-emerald-700 justify-end mt-0.5">
              <IndianRupee className="w-5 h-5" />
              <span>{trip.budget.totalEstimatedCost.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[11px] text-stone-500 block">
              ₹{trip.budget.costPerPerson.toLocaleString('en-IN')} / person ({trip.preferences.travelers} travelers)
            </span>
          </div>
        </div>

        {/* Quick Parameters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Origin</span>
            <p className="font-bold text-stone-800 truncate mt-0.5">{trip.origin}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Destination</span>
            <p className="font-bold text-stone-800 truncate mt-0.5">{trip.destination}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Dietary</span>
            <p className="font-bold text-stone-800 capitalize mt-0.5">{trip.preferences.foodPreference}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Transit Mode</span>
            <p className="font-bold text-stone-800 capitalize mt-0.5">
              {trip.preferences.transportation.replace('-', ' ')}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Est. Total Route</span>
            <p className="font-bold text-stone-800 mt-0.5">{formatDistance(totalStats.distanceKm)}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Est. Transit Time</span>
            <p className="font-bold text-stone-800 mt-0.5">{formatDuration(totalStats.durationMin)}</p>
          </div>
        </div>
      </div>

      {/* Tabs Selector for Left Column (Timeline vs Budget Dashboard) */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'timeline'
                ? 'bg-stone-900 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Itinerary Timeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'budget'
                ? 'bg-stone-900 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Budget Breakdown
          </button>
        </div>
      </div>

      {/* Two-Column Split View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Timeline & AI Panel & Budget) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Day Selector */}
          <DaySelector
            days={trip.days}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />

          {/* AI Modification Assistant */}
          <AiModificationPanel
            onModify={handleModify}
            isLoading={isModifying}
            lastChanges={lastChanges}
            lastMessage={lastMessage}
            onClearFeedback={() => setLastChanges([])}
          />

          {/* Tab Content */}
          {activeTab === 'timeline' ? (
            <ItineraryTimeline
              days={trip.days}
              selectedDay={selectedDay}
              selectedActivityId={selectedActivityId}
              onSelectActivity={(activity) => {
                setSelectedActivityId(activity.id);
                setInspectedItem(activity);
              }}
              onViewDetails={(item) => setInspectedItem(item)}
              onMoveActivity={handleMoveActivity}
              onRemoveActivity={handleRemoveActivity}
              onReplaceActivity={handleReplaceActivity}
              onAddActivity={handleAddActivity}
            />
          ) : (
            <BudgetBreakdown
              budget={trip.budget}
              travelers={trip.preferences.travelers}
              totalDays={trip.summary.totalDays}
              onOptimizeBudget={handleOptimizeBudget}
              isOptimizing={isModifying}
            />
          )}
        </div>

        {/* Right Column (Interactive Google / Vector MapView) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-3">
            <MapView
              days={trip.days}
              selectedDay={selectedDay}
              selectedActivityId={selectedActivityId}
              onSelectActivity={(act) => {
                setSelectedActivityId(act.id);
                setInspectedItem(act);
              }}
              onOpenDetails={(item) => setInspectedItem(item)}
              hotelSuggestions={trip.hotelSuggestions}
              transportMode={trip.preferences.transportation}
            />
          </div>
        </div>
      </div>

      {/* Location Details Slide-Over Drawer */}
      <LocationDetailsPanel
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
        onViewOnMap={() => {
          if (inspectedItem) {
            setSelectedActivityId(inspectedItem.id);
          }
        }}
        onReplace={() => {
          if (inspectedItem && 'durationMinutes' in inspectedItem) {
            handleReplaceActivity(inspectedItem as Activity);
          }
        }}
      />

      {/* Share Trip Modal */}
      <ShareTripModal
        trip={trip}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onTogglePublic={(isPub) => {
          const updated = { ...trip, isPublic: isPub };
          onUpdateTrip(updated);
          saveTrip(updated);
        }}
        onDownloadPdf={() => exportItineraryToPDF(trip)}
      />
    </div>
  );
};

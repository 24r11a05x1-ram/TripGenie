import React, { useState } from 'react';
import { 
  CompleteTrip, 
  Activity, 
  Restaurant 
} from '../types/trip';
import { 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Download, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import { DaySelector } from '../components/itinerary/DaySelector';
import { ItineraryTimeline } from '../components/itinerary/ItineraryTimeline';
import { MapView } from '../components/map/MapView';
import { LocationDetailsPanel } from '../components/itinerary/LocationDetailsPanel';
import { BudgetBreakdown } from '../components/budget/BudgetBreakdown';
import { exportItineraryToPDF } from '../services/pdfService';

interface SharedTripPageProps {
  trip: CompleteTrip;
  onCustomizeTrip: (trip: CompleteTrip) => void;
}

export const SharedTripPage: React.FC<SharedTripPageProps> = ({
  trip,
  onCustomizeTrip,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>(1);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [inspectedItem, setInspectedItem] = useState<Activity | Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'budget'>('timeline');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Public Banner */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Shared Public Travel Itinerary • Generated with TripGenie AI</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportItineraryToPDF(trip)}
            className="px-3.5 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={() => onCustomizeTrip(trip)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <span>Clone & Customize</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Header Overview Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {trip.summary.totalDays} Days • {trip.preferences.travelers} Travelers
            </span>
            <h1 className="text-3xl font-black text-stone-900 mt-1">{trip.title}</h1>
            <p className="text-xs sm:text-sm text-stone-600">{trip.summary.overview}</p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-right shrink-0">
            <span className="text-[11px] font-bold text-stone-500 uppercase block">Estimated Budget</span>
            <div className="flex items-center gap-0.5 text-2xl font-black text-emerald-700 justify-end mt-0.5">
              <IndianRupee className="w-5 h-5" />
              <span>{trip.budget.totalEstimatedCost.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[11px] text-stone-500 block">
              ₹{trip.budget.costPerPerson.toLocaleString('en-IN')} / person
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Dates</span>
            <span className="font-bold text-stone-800">{trip.preferences.startDate} to {trip.preferences.endDate}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Food Preference</span>
            <span className="font-bold text-stone-800 capitalize">{trip.preferences.foodPreference}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Transit</span>
            <span className="font-bold text-stone-800 capitalize">{trip.preferences.transportation.replace('-', ' ')}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Destination</span>
            <span className="font-bold text-stone-800">{trip.destination}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 no-print">
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${
            activeTab === 'timeline' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          Timeline
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${
            activeTab === 'budget' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          Budget
        </button>
      </div>

      {/* Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <DaySelector
            days={trip.days}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />

          {activeTab === 'timeline' ? (
            <ItineraryTimeline
              days={trip.days}
              selectedDay={selectedDay}
              selectedActivityId={selectedActivityId}
              onSelectActivity={(act) => {
                setSelectedActivityId(act.id);
                setInspectedItem(act);
              }}
              onViewDetails={(item) => setInspectedItem(item)}
              onMoveActivity={() => {}}
              onRemoveActivity={() => {}}
              onReplaceActivity={() => {}}
              onAddActivity={() => {}}
            />
          ) : (
            <BudgetBreakdown
              budget={trip.budget}
              travelers={trip.preferences.travelers}
              totalDays={trip.summary.totalDays}
              onOptimizeBudget={() => {}}
            />
          )}
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-8">
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

      <LocationDetailsPanel
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
        onViewOnMap={() => {
          if (inspectedItem) setSelectedActivityId(inspectedItem.id);
        }}
      />
    </div>
  );
};

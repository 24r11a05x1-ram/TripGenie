import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Star, 
  Sparkles, 
  Navigation, 
  RefreshCw, 
  Check, 
  Calendar,
  Share2
} from 'lucide-react';
import { Activity, Restaurant } from '../../types/trip';

interface LocationDetailsPanelProps {
  item: Activity | Restaurant | null;
  onClose: () => void;
  onViewOnMap: () => void;
  onReplace?: () => void;
}

export const LocationDetailsPanel: React.FC<LocationDetailsPanelProps> = ({
  item,
  onClose,
  onViewOnMap,
  onReplace,
}) => {
  if (!item) return null;

  const isActivity = 'durationMinutes' in item;
  const isRestaurant = 'mealType' in item;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-stone-200 flex flex-col no-print animate-in slide-in-from-right duration-250">
      {/* Header */}
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <span
          className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            isActivity
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {isActivity ? (item as Activity).category : (item as Restaurant).mealType}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div>
          <h2 className="text-2xl font-black text-stone-900 leading-tight">
            {item.name}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{item.address}</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
          <div>
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
              Day & Time
            </span>
            <p className="font-bold text-sm text-stone-900 mt-0.5">
              Day {item.dayNumber} {isActivity ? `• ${(item as Activity).startTime}` : ''}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
              Estimated Cost
            </span>
            <p className="font-bold text-sm text-emerald-700 mt-0.5 flex items-center gap-0.5">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>
                {isActivity
                  ? (item as Activity).estimatedCost === 0
                    ? 'Free Entry'
                    : (item as Activity).estimatedCost
                  : `₹${(item as Restaurant).estimatedPrice} / meal`}
              </span>
            </p>
          </div>

          {isActivity && (
            <div>
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
                Duration
              </span>
              <p className="font-bold text-sm text-stone-900 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>{(item as Activity).durationMinutes} mins</span>
              </p>
            </div>
          )}

          {'rating' in item && item.rating && (
            <div>
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
                Rating
              </span>
              <p className="font-bold text-sm text-amber-600 mt-0.5 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.rating} / 5.0</span>
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {'description' in item && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Overview
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {(item as Activity).description}
            </p>
          </div>
        )}

        {/* Cuisine / Dietary Suitability if restaurant */}
        {isRestaurant && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Cuisine & Dietary
            </h4>
            <p className="text-sm font-semibold text-stone-900 mb-1">
              {(item as Restaurant).cuisine}
            </p>
            {(item as Restaurant).foodSuitability && (
              <p className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg font-medium">
                {(item as Restaurant).foodSuitability}
              </p>
            )}
          </div>
        )}

        {/* Tips / Insider advice */}
        {'tips' in item && (item as Activity).tips && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Insider Tip</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              {(item as Activity).tips}
            </p>
          </div>
        )}

        {/* Coordinates */}
        <div className="pt-2 text-xs text-stone-600 flex items-center justify-between border-t border-stone-100">
          <span>Coordinates:</span>
          <span className="font-mono text-stone-600">
            {item.latitude.toFixed(4)}°N, {item.longitude.toFixed(4)}°E
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-stone-100 bg-stone-50 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            onViewOnMap();
            onClose();
          }}
          className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
        >
          <Navigation className="w-4 h-4" />
          <span>View on Map</span>
        </button>

        {onReplace && (
          <button
            type="button"
            onClick={() => {
              onReplace();
              onClose();
            }}
            className="py-2.5 px-4 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Replace</span>
          </button>
        )}
      </div>
    </div>
  );
};

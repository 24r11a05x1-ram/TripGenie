import React from 'react';
import { 
  Plus, 
  MapPin, 
  Utensils, 
  Sun, 
  CloudRain, 
  Navigation, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DailyItinerary, Activity, Restaurant } from '../../types/trip';
import { ActivityCard } from './ActivityCard';
import { RestaurantCard } from './RestaurantCard';
import { formatDistance, formatDuration } from '../../services/routeService';

interface ItineraryTimelineProps {
  days: DailyItinerary[];
  selectedDay: number | 'all';
  selectedActivityId?: string | null;
  onSelectActivity: (activity: Activity) => void;
  onViewDetails: (item: Activity | Restaurant) => void;
  onMoveActivity: (dayNumber: number, fromIdx: number, toIdx: number) => void;
  onRemoveActivity: (dayNumber: number, activityId: string) => void;
  onReplaceActivity: (activity: Activity) => void;
  onAddActivity: (dayNumber: number) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  days,
  selectedDay,
  selectedActivityId,
  onSelectActivity,
  onViewDetails,
  onMoveActivity,
  onRemoveActivity,
  onReplaceActivity,
  onAddActivity,
}) => {
  const displayDays = selectedDay === 'all'
    ? days
    : days.filter((d) => d.dayNumber === selectedDay);

  if (displayDays.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
        <p className="text-stone-500 text-sm">No activities planned for this day yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {displayDays.map((day) => (
        <div key={day.dayNumber} className="space-y-4 print-break-inside-avoid">
          {/* Day Header Banner */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-5 rounded-2xl shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    Day {day.dayNumber}
                  </span>
                  <span className="text-xs text-stone-300 font-medium">
                    {day.date}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mt-1.5 leading-snug">
                  {day.title}
                </h3>
                <p className="text-xs text-stone-300 mt-0.5 italic">
                  Theme: {day.theme}
                </p>
              </div>

              {day.weather && (
                <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-right">
                  <div className="flex items-center gap-1.5 font-bold text-sm justify-end text-amber-300">
                    <Sun className="w-4 h-4 fill-amber-300" />
                    <span>{day.weather.tempC}°C</span>
                  </div>
                  <span className="text-[11px] text-stone-300 block">
                    {day.weather.condition}
                  </span>
                </div>
              )}
            </div>

            {/* Day Route Summary Pill */}
            {day.dayRouteSummary && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-4 text-xs text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Est. Transit: {formatDistance(day.dayRouteSummary.distanceKm)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Travel Time: {formatDuration(day.dayRouteSummary.durationMin)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Activities Timeline */}
          <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-stone-200 before:z-0 pl-1">
            {day.activities.map((activity, idx) => (
              <div key={activity.id} className="relative z-10">
                <ActivityCard
                  activity={activity}
                  isSelected={selectedActivityId === activity.id}
                  isFirst={idx === 0}
                  isLast={idx === day.activities.length - 1}
                  onSelect={() => onSelectActivity(activity)}
                  onViewDetails={() => onViewDetails(activity)}
                  onMoveUp={() => onMoveActivity(day.dayNumber, idx, idx - 1)}
                  onMoveDown={() => onMoveActivity(day.dayNumber, idx, idx + 1)}
                  onRemove={() => onRemoveActivity(day.dayNumber, activity.id)}
                  onReplace={() => onReplaceActivity(activity)}
                />
              </div>
            ))}

            {/* Add Activity Button */}
            <div className="pt-2 no-print">
              <button
                type="button"
                onClick={() => onAddActivity(day.dayNumber)}
                className="w-full py-3 border-2 border-dashed border-stone-300 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-2xl text-stone-600 hover:text-emerald-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Activity to Day {day.dayNumber}</span>
              </button>
            </div>
          </div>

          {/* Recommended Dining for the Day */}
          {day.restaurants.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <Utensils className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    Recommended Dining • Day {day.dayNumber}
                  </h4>
                  <p className="text-xs text-stone-500">
                    Handpicked local eateries matching your dietary preference
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {day.restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onViewOnMap={() => onViewDetails(restaurant)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

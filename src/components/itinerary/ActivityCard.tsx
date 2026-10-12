import React from 'react';
import { 
  Clock, 
  MapPin, 
  IndianRupee, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  RefreshCw, 
  Navigation, 
  Eye, 
  Info,
  Sparkles
} from 'lucide-react';
import { Activity } from '../../types/trip';

interface ActivityCardProps {
  activity: Activity;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onReplace: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onViewDetails,
  onMoveUp,
  onMoveDown,
  onRemove,
  onReplace,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? 'bg-emerald-50/50 border-emerald-500 shadow-lg ring-2 ring-emerald-500/30'
          : 'bg-white border-stone-200/80 hover:border-emerald-300 hover:shadow-md'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top Header: Time, Category & Sequence */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              <span>{activity.startTime}</span>
            </span>

            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
              {activity.category}
            </span>

            {activity.tags?.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="hidden sm:inline-block text-[11px] font-medium text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>{activity.estimatedCost === 0 ? 'Free' : `₹${activity.estimatedCost}`}</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
          {activity.name}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed line-clamp-2">
          {activity.description}
        </p>

        {/* Address & Duration */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5 truncate max-w-[70%]">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{activity.address}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0 font-medium text-stone-600">
            <span>{activity.durationMinutes} mins</span>
          </div>
        </div>

        {/* Tips badge if available */}
        {activity.tips && (
          <div className="mt-2.5 bg-amber-50/80 border border-amber-200/60 rounded-xl px-3 py-1.5 flex items-start gap-1.5 text-[11px] text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">{activity.tips}</span>
          </div>
        )}

        {/* Interactive Action Toolbar (no-print) */}
        <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-1 no-print">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              <span>View on Map</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              <span>Details</span>
            </button>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled={isFirst}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              title="Move Up"
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 rounded-lg transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              title="Move Down"
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 rounded-lg transition-colors"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReplace();
              }}
              title="Replace Activity"
              className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              title="Remove Activity"
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

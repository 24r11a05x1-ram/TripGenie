import React from 'react';
import { Calendar, Sun, CloudRain } from 'lucide-react';
import { DailyItinerary } from '../../types/trip';

interface DaySelectorProps {
  days: DailyItinerary[];
  selectedDay: number | 'all';
  onSelectDay: (day: number | 'all') => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  days,
  selectedDay,
  onSelectDay,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-print">
      <button
        type="button"
        onClick={() => onSelectDay('all')}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
          selectedDay === 'all'
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
        }`}
      >
        <span>All Days ({days.length})</span>
      </button>

      {days.map((day) => {
        const isSelected = selectedDay === day.dayNumber;
        return (
          <button
            key={day.dayNumber}
            type="button"
            onClick={() => onSelectDay(day.dayNumber)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
              isSelected
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
            }`}
          >
            <span>Day {day.dayNumber}</span>
            {day.weather && (
              <span
                className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-400" />
                <span>{day.weather.tempC}°C</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

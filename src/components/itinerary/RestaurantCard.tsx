import React from 'react';
import { Utensils, Star, IndianRupee, MapPin, CheckCircle2, RefreshCw } from 'lucide-react';
import { Restaurant } from '../../types/trip';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onViewOnMap: () => void;
  onReplaceRestaurant?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onViewOnMap,
  onReplaceRestaurant,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-4 hover:border-amber-400 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <Utensils className="w-4 h-4" />
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-md">
              {restaurant.mealType}
            </span>
            <h4 className="font-bold text-stone-900 text-sm mt-0.5">{restaurant.name}</h4>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-xs font-bold text-stone-900 justify-end">
            <IndianRupee className="w-3 h-3 text-amber-600" />
            <span>₹{restaurant.estimatedPrice}</span>
          </div>
          <span className="text-[10px] text-stone-600 font-medium">approx / meal</span>
        </div>
      </div>

      <p className="text-xs text-stone-600 mb-2 font-medium">{restaurant.cuisine}</p>

      {restaurant.foodSuitability && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg mb-2.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate font-semibold">{restaurant.foodSuitability}</span>
        </div>
      )}

      {restaurant.highlights && (
        <p className="text-xs text-stone-500 italic mb-2.5">"{restaurant.highlights}"</p>
      )}

      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-1 truncate max-w-[65%]">
          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="truncate">{restaurant.address}</span>
        </div>

        {restaurant.rating && (
          <div className="flex items-center gap-1 text-amber-600 font-bold shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{restaurant.rating}</span>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between no-print">
        <button
          type="button"
          onClick={onViewOnMap}
          className="text-xs font-semibold text-emerald-700 hover:underline"
        >
          View on Map
        </button>

        {onReplaceRestaurant && (
          <button
            type="button"
            onClick={onReplaceRestaurant}
            className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Replace</span>
          </button>
        )}
      </div>
    </div>
  );
};

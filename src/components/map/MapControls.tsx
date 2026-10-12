import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Compass, Eye, RotateCcw } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitBounds: () => void;
  onResetView: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  showAllMarkers: boolean;
  onToggleShowAll: () => void;
  selectedDay: number | 'all';
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onFitBounds,
  onResetView,
  isFullscreen,
  onToggleFullscreen,
  showAllMarkers,
  onToggleShowAll,
  selectedDay,
}) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-stone-200/80 p-1 flex flex-col gap-1">
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom In"
          className="w-8 h-8 flex items-center justify-center text-stone-700 hover:text-emerald-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom Out"
          className="w-8 h-8 flex items-center justify-center text-stone-700 hover:text-emerald-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-stone-200/80 p-1 flex flex-col gap-1">
        <button
          type="button"
          onClick={onFitBounds}
          title="Fit Visible Stops"
          className="w-8 h-8 flex items-center justify-center text-stone-700 hover:text-emerald-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onResetView}
          title="Reset View to Center"
          className="w-8 h-8 flex items-center justify-center text-stone-700 hover:text-emerald-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleShowAll}
          title={showAllMarkers ? "Filter by Selected Day" : "Show All Days Markers"}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
            showAllMarkers || selectedDay === 'all'
              ? 'text-emerald-600 bg-emerald-50'
              : 'text-stone-700 hover:text-emerald-600 hover:bg-stone-100'
          }`}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
          className="w-8 h-8 flex items-center justify-center text-stone-700 hover:text-emerald-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

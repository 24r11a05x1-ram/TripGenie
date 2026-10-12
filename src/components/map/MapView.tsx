import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Utensils, 
  Hotel, 
  Layers, 
  Star, 
  IndianRupee, 
  ArrowRight, 
  X 
} from 'lucide-react';
import { Activity, Restaurant, HotelSuggestion, DailyItinerary } from '../../types/trip';
import { calculateDayRoute, formatDistance, formatDuration } from '../../services/routeService';
import { MapControls } from './MapControls';

interface MapViewProps {
  days: DailyItinerary[];
  selectedDay: number | 'all';
  selectedActivityId?: string | null;
  onSelectActivity: (activity: Activity) => void;
  onOpenDetails?: (item: Activity | Restaurant) => void;
  hotelSuggestions?: HotelSuggestion[];
  transportMode?: any;
}

// Available Tile Layers
const TILE_LAYERS = {
  voyager: {
    name: 'Travel Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    name: 'Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

export const MapView: React.FC<MapViewProps> = ({
  days,
  selectedDay,
  selectedActivityId,
  onSelectActivity,
  onOpenDetails,
  hotelSuggestions = [],
  transportMode = 'rental-bike',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [mapStyle, setMapStyle] = useState<'voyager' | 'osm' | 'dark'>('voyager');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAllMarkers, setShowAllMarkers] = useState(false);
  const [activePopupItem, setActivePopupItem] = useState<{
    data: Activity | Restaurant | HotelSuggestion;
    type: 'activity' | 'restaurant' | 'hotel';
  } | null>(null);

  // Filter visible items
  const visibleActivities = useMemo(() => {
    if (selectedDay === 'all' || showAllMarkers) {
      return days.flatMap((d) => d.activities);
    }
    const currentDay = days.find((d) => d.dayNumber === selectedDay);
    return currentDay ? currentDay.activities : [];
  }, [days, selectedDay, showAllMarkers]);

  const visibleRestaurants = useMemo(() => {
    if (selectedDay === 'all' || showAllMarkers) {
      return days.flatMap((d) => d.restaurants);
    }
    const currentDay = days.find((d) => d.dayNumber === selectedDay);
    return currentDay ? currentDay.restaurants : [];
  }, [days, selectedDay, showAllMarkers]);

  // Active day route
  const activeDayActivities = useMemo(() => {
    if (selectedDay === 'all') {
      return days[0]?.activities || [];
    }
    return days.find((d) => d.dayNumber === selectedDay)?.activities || [];
  }, [days, selectedDay]);

  const routeData = useMemo(() => {
    return calculateDayRoute(
      activeDayActivities,
      transportMode,
      typeof selectedDay === 'number' ? selectedDay : 1
    );
  }, [activeDayActivities, transportMode, selectedDay]);

  // Center coordinate
  const defaultCenter = useMemo((): [number, number] => {
    if (visibleActivities.length > 0) {
      return [visibleActivities[0].latitude, visibleActivities[0].longitude];
    }
    return [15.4989, 73.8278]; // Default Goa
  }, [visibleActivities]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false, // We use custom MapControls
        attributionControl: false,
      });

      // Add Tile Layer
      const tile = L.tileLayer(TILE_LAYERS[mapStyle].url, {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: TILE_LAYERS[mapStyle].attribution,
      }).addTo(map);

      tileLayerRef.current = tile;

      // Layer groups for markers & routes
      const markersGroup = L.layerGroup().addTo(map);
      const routeGroup = L.layerGroup().addTo(map);

      markersLayerGroupRef.current = markersGroup;
      routeLayerGroupRef.current = routeGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_LAYERS[mapStyle].url);
  }, [mapStyle]);

  // Update Markers and Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const routeGroup = routeLayerGroupRef.current;

    if (!map || !markersGroup || !routeGroup) return;

    markersGroup.clearLayers();
    routeGroup.clearLayers();

    const boundsPoints: L.LatLngExpression[] = [];

    // Helper to create custom HTML pin icon
    const createCustomIcon = (
      title: string,
      type: 'activity' | 'restaurant' | 'hotel',
      seqNumber?: number,
      isSelected?: boolean
    ) => {
      const isAct = type === 'activity';
      const isRest = type === 'restaurant';

      const bgClass = isSelected
        ? 'bg-emerald-700 ring-4 ring-emerald-400 text-white'
        : isAct
        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
        : isRest
        ? 'bg-amber-600 hover:bg-amber-700 text-white'
        : 'bg-indigo-600 hover:bg-indigo-700 text-white';

      const iconSvg = isAct
        ? '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
        : isRest
        ? '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M12 2v20"/><path d="M6 2v6a3 3 0 0 0 6 0V2"/></svg>'
        : '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 3-3 3 3"/></svg>';

      const seqBadge = seqNumber
        ? `<span style="background: rgba(255,255,255,0.25); border-radius: 9999px; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; margin-right: 4px;">${seqNumber}</span>`
        : '';

      const pulseRing = isSelected
        ? '<div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 16px; height: 16px; border-radius: 9999px; background: rgba(16, 185, 129, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>'
        : '';

      const html = `
        <div style="position: relative; cursor: pointer; display: inline-block;">
          <div class="${bgClass}" style="border-radius: 1rem; padding: 4px 10px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 5px; font-weight: 700; font-size: 12px; white-space: nowrap; transform: translateY(-50%);">
            ${seqBadge}
            ${iconSvg}
            <span style="max-width: 120px; overflow: hidden; text-overflow: ellipsis;">${title}</span>
          </div>
          <div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 10px; height: 10px; background: inherit; z-index: -1;"></div>
          ${pulseRing}
        </div>
      `;

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html,
        iconSize: [140, 36],
        iconAnchor: [70, 18],
      });
    };

    // 1. Add Activities Markers
    visibleActivities.forEach((act) => {
      const isSelected = selectedActivityId === act.id;
      const marker = L.marker([act.latitude, act.longitude], {
        icon: createCustomIcon(act.name, 'activity', act.sequenceOrder, isSelected),
        zIndexOffset: isSelected ? 1000 : 100,
      });

      marker.on('click', () => {
        onSelectActivity(act);
        setActivePopupItem({ data: act, type: 'activity' });
      });

      markersGroup.addLayer(marker);
      boundsPoints.push([act.latitude, act.longitude]);
    });

    // 2. Add Restaurants Markers
    visibleRestaurants.forEach((rest) => {
      const marker = L.marker([rest.latitude, rest.longitude], {
        icon: createCustomIcon(rest.name, 'restaurant', rest.sequenceOrder),
        zIndexOffset: 50,
      });

      marker.on('click', () => {
        setActivePopupItem({ data: rest, type: 'restaurant' });
      });

      markersGroup.addLayer(marker);
      boundsPoints.push([rest.latitude, rest.longitude]);
    });

    // 3. Add Hotels Markers
    hotelSuggestions.forEach((hotel) => {
      const marker = L.marker([hotel.latitude, hotel.longitude], {
        icon: createCustomIcon(hotel.name, 'hotel'),
        zIndexOffset: 40,
      });

      marker.on('click', () => {
        setActivePopupItem({ data: hotel, type: 'hotel' });
      });

      markersGroup.addLayer(marker);
      boundsPoints.push([hotel.latitude, hotel.longitude]);
    });

    // 4. Draw Route Polylines
    if (routeData.polylineCoordinates && routeData.polylineCoordinates.length > 1) {
      const latLngs: [number, number][] = routeData.polylineCoordinates.map((pt) => [
        pt.lat,
        pt.lng,
      ]);

      // White outline casing
      const outlinePolyline = L.polyline(latLngs, {
        color: '#ffffff',
        weight: 7,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      });

      // Emerald inner route
      const routePolyline = L.polyline(latLngs, {
        color: '#059669',
        weight: 4.5,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round',
      });

      routeGroup.addLayer(outlinePolyline);
      routeGroup.addLayer(routePolyline);
    }

    // Fit bounds automatically if points exist
    if (boundsPoints.length > 0) {
      const bounds = L.latLngBounds(boundsPoints);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [
    visibleActivities,
    visibleRestaurants,
    hotelSuggestions,
    routeData,
    selectedActivityId,
  ]);

  // Center on selected activity when selected in timeline
  useEffect(() => {
    if (!selectedActivityId || !mapInstanceRef.current) return;
    const target = visibleActivities.find((a) => a.id === selectedActivityId);
    if (target) {
      mapInstanceRef.current.flyTo([target.latitude, target.longitude], 14, {
        duration: 1.2,
      });
      setActivePopupItem({ data: target, type: 'activity' });
    }
  }, [selectedActivityId, visibleActivities]);

  // Map Controls Callbacks
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleFitBounds = () => {
    if (!mapInstanceRef.current) return;
    const allCoords: [number, number][] = [
      ...visibleActivities.map((a): [number, number] => [a.latitude, a.longitude]),
      ...visibleRestaurants.map((r): [number, number] => [r.latitude, r.longitude]),
    ];
    if (allCoords.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current && visibleActivities.length > 0) {
      mapInstanceRef.current.flyTo(
        [visibleActivities[0].latitude, visibleActivities[0].longitude],
        12
      );
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[480px] overflow-hidden rounded-2xl border border-stone-200/90 shadow-inner transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen min-h-screen' : ''
      }`}
    >
      {/* Real Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />

      {/* Top Left Leaflet Status Badge */}
      <div className="absolute top-4 left-4 z-[500] flex flex-col gap-2 max-w-xs pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-md border border-stone-200/90 pointer-events-auto">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Leaflet Itinerary Map
            </span>
            <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
              {selectedDay === 'all' ? 'All Days' : `Day ${selectedDay}`}
            </span>
          </div>
          <div className="text-[11px] text-stone-500 flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
            <span>OpenStreetMap / CARTO Tiles</span>
            <span className="font-semibold text-emerald-700">Live GPS Plot</span>
          </div>
        </div>

        {/* Route Stats Pill if route exists */}
        {routeData.legs.length > 0 && (
          <div className="bg-emerald-900/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-md flex items-center gap-3 text-xs font-medium pointer-events-auto">
            <div className="flex items-center gap-1 text-emerald-200">
              <Navigation className="w-3.5 h-3.5 text-emerald-300" />
              <span>{formatDistance(routeData.totalDistanceKm)}</span>
            </div>
            <span className="text-emerald-500">•</span>
            <div className="flex items-center gap-1 text-emerald-200">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>{formatDuration(routeData.totalDurationMin)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Controls (Top Right) */}
      <div className="z-[500]">
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitBounds={handleFitBounds}
          onResetView={handleResetView}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => {
            setIsFullscreen(!isFullscreen);
            setTimeout(() => {
              mapInstanceRef.current?.invalidateSize();
            }, 250);
          }}
          showAllMarkers={showAllMarkers}
          onToggleShowAll={() => setShowAllMarkers(!showAllMarkers)}
          selectedDay={selectedDay}
        />
      </div>

      {/* Tile Style Selector (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[500] flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-stone-200/90 text-xs">
        <button
          type="button"
          onClick={() => setMapStyle('voyager')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            mapStyle === 'voyager'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Voyager
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('osm')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            mapStyle === 'osm'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          OSM
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('dark')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            mapStyle === 'dark'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Dark
        </button>
      </div>

      {/* Bottom Right Legend */}
      <div className="absolute bottom-4 right-4 z-[500] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-stone-200/90 text-xs flex items-center gap-3">
        <div className="flex items-center gap-1 text-stone-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>Attractions</span>
        </div>
        <div className="flex items-center gap-1 text-stone-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
          <span>Food</span>
        </div>
        <div className="flex items-center gap-1 text-stone-700">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <span>Stays</span>
        </div>
      </div>

      {/* Interactive Detail Popup Drawer / Modal Overlay */}
      {activePopupItem && (
        <div className="absolute bottom-16 left-4 right-4 sm:left-auto sm:right-4 z-[600] w-auto sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200/90 p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  activePopupItem.type === 'activity'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activePopupItem.type === 'restaurant'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {activePopupItem.type === 'activity'
                  ? (activePopupItem.data as Activity).category
                  : activePopupItem.type === 'restaurant'
                  ? (activePopupItem.data as Restaurant).mealType
                  : 'Hotel'}
              </span>
              <h4 className="font-bold text-stone-900 text-sm mt-1 leading-snug">
                {activePopupItem.data.name}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setActivePopupItem(null)}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-500 line-clamp-1 mb-2">
            {activePopupItem.data.address}
          </p>

          {'description' in activePopupItem.data && (
            <p className="text-xs text-stone-600 line-clamp-2 mb-3">
              {(activePopupItem.data as Activity).description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 py-2 border-y border-stone-100 text-xs text-stone-600 mb-3">
            {'durationMinutes' in activePopupItem.data && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{(activePopupItem.data as Activity).durationMinutes} mins</span>
              </div>
            )}
            {'estimatedCost' in activePopupItem.data && (
              <div className="flex items-center gap-1 font-semibold text-stone-900">
                <IndianRupee className="w-3 h-3 text-emerald-600" />
                <span>
                  {(activePopupItem.data as Activity).estimatedCost === 0
                    ? 'Free Entry'
                    : `₹${(activePopupItem.data as Activity).estimatedCost}`}
                </span>
              </div>
            )}
            {'estimatedPrice' in activePopupItem.data && (
              <div className="flex items-center gap-1 font-semibold text-stone-900">
                <IndianRupee className="w-3 h-3 text-amber-600" />
                <span>₹{(activePopupItem.data as Restaurant).estimatedPrice} / meal</span>
              </div>
            )}
            {'rating' in activePopupItem.data && (activePopupItem.data as any).rating && (
              <div className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{(activePopupItem.data as any).rating} / 5</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onOpenDetails && (
              <button
                type="button"
                onClick={() => {
                  onOpenDetails(activePopupItem.data as any);
                  setActivePopupItem(null);
                }}
                className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Globe, 
  Lock, 
  Download, 
  Sparkles, 
  QrCode 
} from 'lucide-react';
import { CompleteTrip } from '../../types/trip';

interface ShareTripModalProps {
  trip: CompleteTrip;
  isOpen: boolean;
  onClose: () => void;
  onTogglePublic: (isPublic: boolean) => void;
  onDownloadPdf: () => void;
}

export const ShareTripModal: React.FC<ShareTripModalProps> = ({
  trip,
  isOpen,
  onClose,
  onTogglePublic,
  onDownloadPdf,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/#shared-trip/${trip.shareId || trip.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900">Share Itinerary</h3>
              <p className="text-xs text-stone-500">Collaborate with fellow travelers</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public Sharing Toggle */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {trip.isPublic ? (
              <Globe className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <Lock className="w-5 h-5 text-stone-500 shrink-0" />
            )}
            <div>
              <h4 className="text-xs font-bold text-stone-900">
                {trip.isPublic ? 'Publicly Accessible' : 'Private Only'}
              </h4>
              <p className="text-[11px] text-stone-500">
                {trip.isPublic
                  ? 'Anyone with the link can view itinerary & map'
                  : 'Only you can view this itinerary'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={trip.isPublic}
              onChange={(e) => onTogglePublic(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Share Link Input */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Shareable Web Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-mono focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Download PDF Option */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              onDownloadPdf();
              onClose();
            }}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Formatted PDF Itinerary</span>
          </button>
        </div>

        <p className="text-[11px] text-stone-500 text-center">
          Shared itineraries do not expose private personal emails or account credentials.
        </p>
      </div>
    </div>
  );
};

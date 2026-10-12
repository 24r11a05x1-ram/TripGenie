import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  X,
  Compass,
  Sunset,
  DollarSign,
  UtensilsCrossed,
  Smile
} from 'lucide-react';

interface AiModificationPanelProps {
  onModify: (promptText: string) => Promise<void>;
  isLoading: boolean;
  lastChanges?: string[];
  lastMessage?: string;
  onClearFeedback?: () => void;
}

const QUICK_PROMPTS = [
  { label: 'Less crowded beach', prompt: 'Replace Baga Beach with a less crowded beach (e.g. Ashwem or Morjim)', icon: Compass },
  { label: 'Add sunset activity', prompt: 'Add a sunset activity on Day 1 or Day 2', icon: Sunset },
  { label: 'Reduce budget to ₹12,000', prompt: 'Reduce the total trip budget to ₹12,000 with affordable alternatives', icon: DollarSign },
  { label: 'More vegetarian food', prompt: 'Include more 100% pure vegetarian restaurants', icon: UtensilsCrossed },
  { label: 'Make Day 2 more relaxing', prompt: 'Make Day 2 more relaxing with low transit and tranquil beach lounging', icon: Smile },
];

export const AiModificationPanel: React.FC<AiModificationPanelProps> = ({
  onModify,
  isLoading,
  lastChanges,
  lastMessage,
  onClearFeedback,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const prompt = inputText;
    setInputText('');
    await onModify(prompt);
  };

  const handleQuickClick = async (prompt: string) => {
    if (isLoading) return;
    await onModify(prompt);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl shadow-xl p-5 sm:p-6 no-print space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-tight text-white">
              AI Travel Assistant
            </h3>
            <p className="text-xs text-emerald-200/80">
              Personalize, replace stops, adjust budget, or pace your trip in real time
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {QUICK_PROMPTS.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickClick(item.prompt)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-emerald-100 border border-white/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Icon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Freeform Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. 'Add a scenic evening cruise' or 'Include vegan cafes'..."
          disabled={isLoading}
          className="w-full pl-4 pr-24 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-emerald-200/60 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-emerald-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <span>Apply</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Changes Notification Feedback */}
      {lastChanges && lastChanges.length > 0 && (
        <div className="p-4 bg-emerald-800/60 rounded-xl border border-emerald-400/30 text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {lastMessage || 'Itinerary Updated Successfully!'}
            </span>
            {onClearFeedback && (
              <button
                type="button"
                onClick={onClearFeedback}
                className="text-emerald-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <ul className="space-y-1 pl-4 list-disc text-emerald-100">
            {lastChanges.map((change, i) => (
              <li key={i}>{change}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

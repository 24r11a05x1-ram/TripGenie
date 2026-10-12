import React, { useState } from 'react';
import { 
  IndianRupee, 
  Bed, 
  Utensils, 
  Bike, 
  Ticket, 
  ShoppingBag, 
  AlertTriangle, 
  Sparkles, 
  Users, 
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { BudgetBreakdown as BudgetType } from '../../types/trip';

interface BudgetBreakdownProps {
  budget: BudgetType;
  travelers: number;
  totalDays: number;
  onOptimizeBudget: () => void;
  isOptimizing?: boolean;
}

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({
  budget,
  travelers,
  totalDays,
  onOptimizeBudget,
  isOptimizing = false,
}) => {
  const [viewMode, setViewMode] = useState<'total' | 'perPerson'>('total');

  const divisor = viewMode === 'perPerson' ? Math.max(1, travelers) : 1;

  const accommodation = Math.round(budget.accommodation / divisor);
  const food = Math.round(budget.food / divisor);
  const transportation = Math.round(budget.transportation / divisor);
  const activities = Math.round(budget.activities / divisor);
  const misc = Math.round(budget.miscellaneous / divisor);
  const total = Math.round(budget.totalEstimatedCost / divisor);
  const target = Math.round(budget.targetBudget / divisor);
  const dailyAverage = Math.round(total / Math.max(1, totalDays));

  const categories = [
    { name: 'Accommodation', amount: accommodation, icon: Bed, color: 'bg-indigo-500', percent: Math.round((budget.accommodation / budget.totalEstimatedCost) * 100) },
    { name: 'Food & Dining', amount: food, icon: Utensils, color: 'bg-amber-500', percent: Math.round((budget.food / budget.totalEstimatedCost) * 100) },
    { name: 'Transportation', amount: transportation, icon: Bike, color: 'bg-emerald-500', percent: Math.round((budget.transportation / budget.totalEstimatedCost) * 100) },
    { name: 'Activities & Fees', amount: activities, icon: Ticket, color: 'bg-purple-500', percent: Math.round((budget.activities / budget.totalEstimatedCost) * 100) },
    { name: 'Miscellaneous', amount: misc, icon: ShoppingBag, color: 'bg-stone-500', percent: Math.round((budget.miscellaneous / budget.totalEstimatedCost) * 100) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Header and Per-Person Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-stone-900 tracking-tight">
            Trip Budget Breakdown
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Transparent estimated expenses based on local rates
          </p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('total')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'total'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Total Group ({travelers})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('perPerson')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              viewMode === 'perPerson'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Per Person</span>
          </button>
        </div>
      </div>

      {/* Main Numbers Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Total Estimated Cost
          </span>
          <div className="flex items-center gap-1 text-2xl font-black text-stone-900 mt-1">
            <IndianRupee className="w-5 h-5 text-emerald-600" />
            <span>{total.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-xs text-stone-500 mt-1 block">
            ~₹{dailyAverage.toLocaleString('en-IN')} / day
          </span>
        </div>

        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Target Budget
          </span>
          <div className="flex items-center gap-1 text-2xl font-black text-stone-700 mt-1">
            <IndianRupee className="w-5 h-5 text-stone-400" />
            <span>{target.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-xs text-stone-500 mt-1 block">
            Configured budget
          </span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            budget.isOverBudget
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block">
            {budget.isOverBudget ? 'Over Budget By' : 'Remaining Savings'}
          </span>
          <div className="flex items-center gap-1 text-2xl font-black mt-1">
            <IndianRupee className="w-5 h-5" />
            <span>{Math.abs(Math.round(budget.difference / divisor)).toLocaleString('en-IN')}</span>
          </div>
          <span className="text-xs font-semibold mt-1 block">
            {budget.isOverBudget ? 'Exceeds budget target' : 'Within budget target'}
          </span>
        </div>
      </div>

      {/* Over-budget alert and optimizer CTA */}
      {budget.isOverBudget && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-900">
                Itinerary is ₹{Math.abs(budget.difference).toLocaleString('en-IN')} over target budget
              </p>
              <p className="text-xs text-rose-700">
                Our AI budget optimizer can replace high-cost stops with economical alternatives.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOptimizeBudget}
            disabled={isOptimizing}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isOptimizing ? 'Optimizing...' : 'Optimize Budget with AI'}</span>
          </button>
        </div>
      )}

      {/* Visual Multi-Segment Progress Bar */}
      <div>
        <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
          {categories.map((c, i) => (
            <div
              key={i}
              style={{ width: `${c.percent}%` }}
              className={`${c.color} transition-all duration-300`}
              title={`${c.name}: ${c.percent}%`}
            />
          ))}
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div
              key={i}
              className="p-3 bg-stone-50/80 rounded-xl border border-stone-200/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className={`p-2 rounded-lg text-white ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{cat.name}</h4>
                  <span className="text-[11px] text-stone-500">{cat.percent}% of total</span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-0.5 text-xs font-black text-stone-900">
                  <IndianRupee className="w-3 h-3 text-stone-500" />
                  <span>{cat.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Optimization Suggestions if any */}
      {budget.optimizationSuggestions && budget.optimizationSuggestions.length > 0 && (
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Budget Insights & Money-Saving Tips</span>
          </div>
          <ul className="space-y-1.5 pl-5 list-disc text-xs text-emerald-800">
            {budget.optimizationSuggestions.map((tip, idx) => (
              <li key={idx} className="leading-relaxed font-medium">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

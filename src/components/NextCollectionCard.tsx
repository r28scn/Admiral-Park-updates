import React from 'react';
import { Calendar, AlertTriangle, Recycle, Trash2, Apple, Trees, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ScheduleEntry } from '../types';
import { formatCollectionDate, getCountdownInfo } from '../utils/schedule';

interface NextCollectionCardProps {
  nextEntry: ScheduleEntry;
  followingEntry: ScheduleEntry;
  collectionDay: string;
  onViewSchedule: () => void;
  onOpenFinder: () => void;
  onExportCalendar: () => void;
  onReportMissed: () => void;
}

export const NextCollectionCard: React.FC<NextCollectionCardProps> = ({
  nextEntry,
  followingEntry,
  collectionDay,
  onViewSchedule,
  onOpenFinder,
  onExportCalendar,
  onReportMissed
}) => {
  const countdown = getCountdownInfo(nextEntry.date);
  const isRecycle = nextEntry.type === 'recycling';

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 sm:p-8 shadow-sm transition-all duration-300">
      
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>Upcoming Kerbside Collection</span>
          <span aria-hidden="true">·</span>
          <span>GU10 Route</span>
        </div>

        {/* Countdown Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tabular-nums ${
          countdown.isToday
            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            : countdown.isTomorrow
            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{countdown.text}</span>
        </div>
      </div>

      {/* Main Date Display */}
      <div className="my-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {formatCollectionDate(nextEntry.date)}
        </h2>

        {nextEntry.isBankHolidayShift && (
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-md border border-amber-200 dark:border-amber-800/60">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Bank Holiday adjustment: {nextEntry.holidayName} shifted collection by 1 day</span>
          </div>
        )}
      </div>

      {/* Bins to Put Out Spotlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        
        {/* Bin 1: Green or Black */}
        {isRecycle ? (
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Green Bin</h3>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  Mixed Recycling
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Clean plastic bottles, food tins, drink cans, paper, flattened cardboard boxes, aluminium foil.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Black Bin</h3>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  General Rubbish
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Non-recyclable household waste, plastic films, crisp packets, greasy pizza box bases, sanitary waste.
              </p>
            </div>
          </div>
        )}

        {/* Bin 2: Brown Food Waste Caddy (Every week) */}
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50">
          <div className="w-12 h-12 rounded-xl bg-amber-800 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Apple className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Food Caddy</h3>
              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                Collected Weekly
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              All cooked & raw food leftovers, meat & bones, teabags, coffee grounds, bread, fruit & vegetable peelings.
            </p>
          </div>
        </div>

        {/* Optional Garden Bin if present in bins */}
        {nextEntry.bins.some(b => b.includes('Garden')) && (
          <div className="sm:col-span-2 flex items-start gap-4 p-4 rounded-2xl bg-lime-50/70 dark:bg-lime-950/20 border border-lime-200 dark:border-lime-800/50">
            <div className="w-12 h-12 rounded-xl bg-lime-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Trees className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Brown Garden Bin</h3>
                <span className="text-[10px] font-semibold text-lime-700 dark:text-lime-300 uppercase tracking-wider">
                  Opt-In Service
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Grass cuttings, hedge clippings, leaves, flowers and weeds. No soil, logs, or plastic plant pots.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Kerbside Rule Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong className="text-slate-900 dark:text-white font-semibold">Guildford Kerbside Rule:</strong> Place bins at your property boundary by <strong className="text-slate-900 dark:text-white">6:30 AM</strong> on collection day.
          </span>
        </div>

        <button
          onClick={onOpenFinder}
          className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
        >
          <span>What goes in which bin?</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Following Week & Action Strip */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Following Week Preview */}
        <div 
          onClick={onViewSchedule}
          className="group flex items-center gap-3 cursor-pointer text-xs"
        >
          <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Following Week:
          </span>
          <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {formatCollectionDate(followingEntry.date)}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            ({followingEntry.type === 'recycling' ? 'Green Recycling & Food' : 'Black Rubbish & Food'})
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCalendar}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Add to Calendar</span>
          </button>
          
          <button
            onClick={onReportMissed}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Report Missed Bin
          </button>
        </div>

      </div>

    </div>
  );
};

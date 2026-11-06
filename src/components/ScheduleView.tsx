import React, { useState } from 'react';
import { Calendar, Download, AlertTriangle, Recycle, Trash2, Apple, Trees, Filter, Check } from 'lucide-react';
import { ScheduleEntry } from '../types';
import { formatCollectionDate } from '../utils/schedule';

interface ScheduleViewProps {
  schedule: ScheduleEntry[];
  collectionDay: string;
  onExportCalendar: () => void;
  onChangeDay: (newDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday') => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  collectionDay,
  onExportCalendar,
  onChangeDay
}) => {
  const [filter, setFilter] = useState<'all' | 'recycling' | 'rubbish'>('all');

  const filteredSchedule = schedule.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Collection Schedule
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            26-Week alternating cycle · Guildford Borough Council (GU10)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Day Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Weekday:</span>
            <select
              value={collectionDay}
              onChange={(e) => onChangeDay(e.target.value as any)}
              className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>

          {/* Sync iCal */}
          <button
            onClick={onExportCalendar}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .ics</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Collections ({schedule.length})
        </button>
        <button
          onClick={() => setFilter('recycling')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            filter === 'recycling'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Recycling Weeks
        </button>
        <button
          onClick={() => setFilter('rubbish')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            filter === 'rubbish'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Rubbish Weeks
        </button>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {filteredSchedule.map((item, idx) => {
          const isRecycle = item.type === 'recycling';
          const isFirstUpcoming = idx === 0 && filter === 'all';

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isFirstUpcoming
                  ? 'border-emerald-500/80 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {formatCollectionDate(item.date)}
                    </span>
                    {isFirstUpcoming && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                        Next Up
                      </span>
                    )}
                  </div>

                  {item.isBankHolidayShift && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{item.holidayName}: shifted to {item.date.toLocaleDateString('en-GB', { weekday: 'long' })}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isRecycle ? 'Green Bin (Mixed Recycling) & Brown Food Caddy' : 'Black Bin (Rubbish) & Brown Food Caddy'}
                    {item.bins.some(b => b.includes('Garden')) && ' · Brown Garden Bin'}
                  </p>
                </div>

                {/* Bin Badges */}
                <div className="flex items-center gap-2 shrink-0">
                  {isRecycle ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <Recycle className="w-3.5 h-3.5" />
                      <span>Green Bin</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Black Bin</span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <Apple className="w-3.5 h-3.5" />
                    <span>Food</span>
                  </span>

                  {item.bins.some(b => b.includes('Garden')) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 border border-lime-200 dark:border-lime-800">
                      <Trees className="w-3.5 h-3.5" />
                      <span>Garden</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Council source attribution */}
      <div className="text-center pt-2 text-xs text-slate-400 dark:text-slate-500">
        Waste collection dates sourced from Guildford Borough Council · my.guildford.gov.uk
      </div>

    </div>
  );
};

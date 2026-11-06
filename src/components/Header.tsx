import React from 'react';
import { Calendar, Download, Settings, Snowflake, Sun, Moon } from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  settings: AppSettings;
  onOpenSettings: () => void;
  onExportCalendar: () => void;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  settings,
  onOpenSettings,
  onExportCalendar,
  onToggleTheme
}) => {
  const navItems = [
    { id: 'home', label: 'Overview' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'finder', label: 'Bin Finder' },
    { id: 'noticeboard', label: 'Noticeboard' },
    { id: 'estate', label: 'Estate Hub' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onTabChange('home')}
          className="text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors whitespace-nowrap">
            Admiral Park
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`transition-colors whitespace-nowrap relative py-1 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Quick Tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick theme cycle button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme style"
            title={`Current theme: ${settings.theme}. Click to switch.`}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {settings.theme === 'snow' ? (
              <Snowflake className="w-4 h-4 text-sky-400" />
            ) : settings.theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Export to Calendar CTA */}
          <button
            onClick={onExportCalendar}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            title="Download .ics calendar with reminders"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sync iCal</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="App settings"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

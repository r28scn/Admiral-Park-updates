/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Calendar, 
  Search, 
  MessageSquare, 
  Sparkles, 
  Download, 
  AlertCircle, 
  Check, 
  Phone, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  Recycle,
  Trash2,
  Apple
} from 'lucide-react';

import { AppSettings, NoticeItem, WeatherDay } from './types';
import { getUpcomingSchedule, downloadCalendarIcs, formatCollectionDate } from './utils/schedule';
import { fetchLiveBBCWeather, INITIAL_BBC_FORECAST } from './data/weather';
import { INITIAL_NOTICES } from './data/initialNotices';

import { Header } from './components/Header';
import { LiveWeatherBanner } from './components/LiveWeatherBanner';
import { NextCollectionCard } from './components/NextCollectionCard';
import { ScheduleView } from './components/ScheduleView';
import { BinSortingFinder } from './components/BinSortingFinder';
import { NoticeboardView } from './components/NoticeboardView';
import { EstateManagementModal } from './components/EstateManagementModal';
import { SettingsModal } from './components/SettingsModal';
import { MissedBinModal } from './components/MissedBinModal';
import { BottomNav } from './components/BottomNav';
import { SnowEffect } from './components/SnowEffect';

export default function App() {
  // --- Persistent Settings State ---
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedDay = localStorage.getItem('admiral_park_col_day') as any;
    const savedTheme = localStorage.getItem('admiral_park_theme') as any;
    const savedGarden = localStorage.getItem('admiral_park_garden_waste') === 'true';

    return {
      collectionDay: savedDay || 'Monday',
      theme: savedTheme || 'snow', // Preserves user's default snow theme!
      includeGardenWaste: savedGarden,
      reminderTiming: 'evening_before_7pm',
      notificationsEnabled: false
    };
  });

  // --- Active Tab State ---
  const [currentTab, setCurrentTab] = useState<'home' | 'schedule' | 'finder' | 'noticeboard' | 'estate'>('home');

  // --- Modals State ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEstateReportOpen, setIsEstateReportOpen] = useState(false);
  const [isMissedBinOpen, setIsMissedBinOpen] = useState(false);

  // --- Toast State ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Notices State: Only Alder Electrical and It's Your Place ---
  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    const saved = localStorage.getItem('admiral_park_notices');
    if (saved) {
      try {
        const parsed: NoticeItem[] = JSON.parse(saved);
        const filtered = parsed.filter(n =>
          n.title.toLowerCase().includes('alder') ||
          n.title.toLowerCase().includes('your place') ||
          n.id.startsWith('notice-')
        );
        if (filtered.length > 0) return filtered;
      } catch {
        return INITIAL_NOTICES;
      }
    }
    return INITIAL_NOTICES;
  });

  // --- BBC Weather Data (Location 2649660) ---
  const [weatherData, setWeatherData] = useState<{
    days: WeatherDay[];
    lastUpdated: string;
    locationName: string;
  }>({
    days: INITIAL_BBC_FORECAST,
    lastUpdated: 'Live Feed',
    locationName: 'Farnham & Guildford (GU10)'
  });
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const loadWeather = async (showToastFeedback = false) => {
    setIsWeatherLoading(true);
    try {
      const data = await fetchLiveBBCWeather();
      setWeatherData(data);
      if (showToastFeedback) {
        showToast('Updated forecast from BBC Weather (2649660)');
      }
    } catch {
      // Keep existing data on error
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  // --- Schedule Calculation ---
  const schedule = useMemo(() => {
    return getUpcomingSchedule(settings.collectionDay, settings.includeGardenWaste, 26);
  }, [settings.collectionDay, settings.includeGardenWaste]);

  const nextEntry = schedule[0];
  const followingEntry = schedule[1];

  // --- Sync theme with <html> class ---
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    localStorage.setItem('admiral_park_theme', settings.theme);
  }, [settings.theme]);

  // --- Sync other settings with localStorage ---
  useEffect(() => {
    localStorage.setItem('admiral_park_col_day', settings.collectionDay);
    localStorage.setItem('admiral_park_garden_waste', String(settings.includeGardenWaste));
  }, [settings.collectionDay, settings.includeGardenWaste]);

  // --- Sync notices with localStorage ---
  useEffect(() => {
    localStorage.setItem('admiral_park_notices', JSON.stringify(notices));
  }, [notices]);

  // --- Toast Trigger Helper ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleUpdateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  const handleResetSettings = () => {
    setSettings({
      collectionDay: 'Monday',
      theme: 'snow',
      includeGardenWaste: false,
      reminderTiming: 'evening_before_7pm',
      notificationsEnabled: false
    });
  };

  const handleToggleTheme = () => {
    setSettings((prev) => {
      const cycle: Record<AppSettings['theme'], AppSettings['theme']> = {
        'snow': 'standard',
        'standard': 'light',
        'light': 'snow'
      };
      const nextTheme = cycle[prev.theme];
      showToast(`Switched theme to ${nextTheme === 'snow' ? 'Snow ❄' : nextTheme === 'light' ? 'Daylight' : 'Standard Dark'}`);
      return { ...prev, theme: nextTheme };
    });
  };

  const handleExportCalendar = () => {
    downloadCalendarIcs(schedule);
    showToast('Downloaded bin schedule (.ics) for Apple/Google Calendar!');
  };

  const handleAddNotice = (newNotice: Omit<NoticeItem, 'id'>) => {
    const item: NoticeItem = {
      ...newNotice,
      id: `notice-${Date.now()}`
    };
    setNotices((prev) => [item, ...prev]);
    showToast('Your notice has been posted to the board!');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${
      settings.theme === 'snow'
        ? 'bg-[#0b1329] text-slate-100 selection:bg-sky-500 selection:text-white'
        : settings.theme === 'light'
        ? 'bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white'
        : 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white'
    }`}>
      
      {/* Falling Snow Effect when snow theme is on */}
      {settings.theme === 'snow' && <SnowEffect />}

      {/* Top Header Contract */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab as any)}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportCalendar={handleExportCalendar}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 md:pb-16 space-y-8">
        
        {/* TAB 1: OVERVIEW / HOME */}
        {currentTab === 'home' && (
          <div className="space-y-6 sm:space-y-8">
            
            {/* 1. Next Collection Spotlight Card - Top of the page */}
            <NextCollectionCard
              nextEntry={nextEntry}
              followingEntry={followingEntry}
              collectionDay={settings.collectionDay}
              onViewSchedule={() => setCurrentTab('schedule')}
              onOpenFinder={() => setCurrentTab('finder')}
              onExportCalendar={handleExportCalendar}
              onReportMissed={() => setIsMissedBinOpen(true)}
            />

            {/* 2. Hero Banner with User Uploaded Development Render */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
                
                {/* Left: Text & Key Status */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white dark:bg-slate-900/95 z-10">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                      <span>GU10 Community & Waste Hub</span>
                      <span aria-hidden="true">·</span>
                      <span>Guildford Borough</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
                      Admiral Park
                    </h1>

                    <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                      Kerbside collection tracker, recycling sorting guide, live BBC weather alerts, and local estate management for residents.
                    </p>
                  </div>

                  {/* Quick Shortcut Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setCurrentTab('finder')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>What bin does it go into?</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('schedule')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Full 26-Week Schedule</span>
                    </button>

                    <button
                      onClick={() => setIsEstateReportOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-800 rounded-xl transition-colors cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Estate Management</span>
                    </button>
                  </div>
                </div>

                {/* Right: Uploaded Official Development Render */}
                <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
                  <img
                    src="/src/assets/images/admiral_park_hero.jpg"
                    alt="Admiral Park development in Tongham, Surrey"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white dark:from-slate-900 via-transparent to-transparent opacity-80" />
                </div>

              </div>
            </div>

            {/* 3. Live BBC Weather Forecast (Location 2649660) */}
            <LiveWeatherBanner
              weatherList={weatherData.days}
              locationName={weatherData.locationName}
              lastUpdated={weatherData.lastUpdated}
              isLoading={isWeatherLoading}
              onRefresh={() => loadWeather(true)}
            />

            {/* Two Column Grid: Management & Verified Trades Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Development Management Preview */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        Development Management
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        It's Your Place Ltd · Managing Agent
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    For all issues regarding management of the Admiral Park development, communal grounds, automated access gates, or bin stores, contact Property Manager Dean.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href="mailto:dean@itsyourplace.co.uk"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>dean@itsyourplace.co.uk</span>
                  </a>

                  <button
                    onClick={() => setIsEstateReportOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Report Issue
                  </button>
                </div>
              </div>

              {/* Local Electrician - Alder Electrical (Preserved from original) */}
              <div className="p-6 rounded-3xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>Local Electrician</span>
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Alder Electrical · Sam & Ellie
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Resident Recommended
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Trusted electrical installations, EV charger setups, fuse boards, and safety testing for Admiral Park and GU10 properties.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:07538837840"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span>07538 837 840</span>
                    </a>

                    <a
                      href="mailto:ellie@alder-electrical.co.uk"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-sky-500" />
                      <span>Email Ellie</span>
                    </a>
                  </div>

                  <button
                    onClick={() => setCurrentTab('noticeboard')}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    View All Notices →
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: SCHEDULE */}
        {currentTab === 'schedule' && (
          <ScheduleView
            schedule={schedule}
            collectionDay={settings.collectionDay}
            onExportCalendar={handleExportCalendar}
            onChangeDay={(newDay) => {
              handleUpdateSettings({ collectionDay: newDay });
              showToast(`Collection day updated to ${newDay}`);
            }}
          />
        )}

        {/* TAB 3: BIN FINDER */}
        {currentTab === 'finder' && (
          <BinSortingFinder />
        )}

        {/* TAB 4: NOTICEBOARD */}
        {currentTab === 'noticeboard' && (
          <NoticeboardView
            notices={notices}
            onAddNotice={handleAddNotice}
            onOpenEstateReport={() => setIsEstateReportOpen(true)}
          />
        )}

        {/* TAB 5: ESTATE HUB */}
        {currentTab === 'estate' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Estate Management & Resident Services
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Admiral Park Development (GU10) · Managed by It's Your Place Ltd
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Welcome to the Admiral Park estate resources portal. Here you can submit maintenance requests to Dean, view communal service schedules, and access emergency infrastructure contacts.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setIsEstateReportOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Report Maintenance Issue to Dean</span>
                </button>
              </div>
            </div>

            {/* Estate Policies & Reminders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Recycle className="w-4 h-4 text-emerald-500" />
                  <span>Bin Store & Refuse Rules</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Please return bins to their designated private or communal stores by the evening of collection day. Do not leave wheelie bins permanently blocking public pavements or kerbs.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-500" />
                  <span>Grounds Maintenance</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Communal lawns and perimeter hedges are maintained on a fortnightly schedule by approved landscaping contractors. Fallen leaf clearance runs through December.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-500" />
                  <span>Visitor Parking</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Marked visitor parking spaces are reserved for short-stay guest vehicles only. Please keep residential driveways and vehicle turning bays clear at all times for emergency access.
                </p>
              </div>
            </div>

            {/* Quick Contacts List */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Essential Resident Helplines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block">Managing Agent</span>
                  <span className="text-slate-500">It's Your Place Ltd</span>
                  <a href="mailto:dean@itsyourplace.co.uk" className="text-emerald-600 dark:text-emerald-400 block mt-1 font-medium">
                    dean@itsyourplace.co.uk
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block">Guildford Waste Dept</span>
                  <span className="text-slate-500">Missed Bins & Queries</span>
                  <a href="tel:01483444499" className="text-slate-700 dark:text-slate-300 block mt-1 font-medium">
                    01483 444 499
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block">Power Cut Emergencies</span>
                  <span className="text-slate-500">UK Power Networks</span>
                  <a href="tel:105" className="text-amber-600 dark:text-amber-400 block mt-1 font-medium">
                    Call 105
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block">Water / Leak Emergency</span>
                  <span className="text-slate-500">Thames Water 24/7</span>
                  <a href="tel:08003169800" className="text-sky-600 dark:text-sky-400 block mt-1 font-medium">
                    0800 316 9800
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Admiral Park Hub</span>
            <span aria-hidden="true">·</span>
            <span>GU10 Guildford, Surrey</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://my.guildford.gov.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              my.guildford.gov.uk
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="mailto:dean@itsyourplace.co.uk"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              dean@itsyourplace.co.uk
            </a>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Bottom Mobile Tab Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab as any)}
      />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
        onShowToast={showToast}
      />

      <EstateManagementModal
        isOpen={isEstateReportOpen}
        onClose={() => setIsEstateReportOpen(false)}
        onShowToast={showToast}
      />

      <MissedBinModal
        isOpen={isMissedBinOpen}
        onClose={() => setIsMissedBinOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-semibold shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

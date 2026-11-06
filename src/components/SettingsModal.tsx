import React from 'react';
import { Calendar, Palette, Bell, Check, Snowflake, Sun, Moon, Trees, RotateCcw, X } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetSettings: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  onShowToast
}) => {
  if (!isOpen) return null;

  const handleToggleNotifications = async () => {
    if (!('Notification' in window)) {
      onShowToast('Browser notifications not supported on this device');
      return;
    }

    if (Notification.permission === 'granted') {
      const nextState = !settings.notificationsEnabled;
      onUpdateSettings({ notificationsEnabled: nextState });
      onShowToast(nextState ? 'Bin reminders enabled!' : 'Bin reminders disabled');
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onUpdateSettings({ notificationsEnabled: true });
        new Notification('Admiral Park Bin Reminder', {
          body: 'Reminders enabled! You will be alerted the evening before your bin day.'
        });
        onShowToast('Notifications permitted & enabled!');
      } else {
        onShowToast('Notification permission was declined');
      }
    } else {
      onShowToast('Please allow notifications in your browser settings');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              App Preferences
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize Admiral Park bin schedules, themes and notifications
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Collection Day Preference */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Kerbside Collection Weekday</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Admiral Park typically receives collections on Mondays. Select your verified weekday:
            </p>
            <select
              value={settings.collectionDay}
              onChange={(e) => onUpdateSettings({ collectionDay: e.target.value as any })}
              className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Monday">Monday (Standard Admiral Park route)</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>

          {/* Theme Style Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <Palette className="w-4 h-4 text-sky-500" />
              <span>Theme Style</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Standard Theme */}
              <button
                onClick={() => onUpdateSettings({ theme: 'standard' })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === 'standard'
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4 text-emerald-500" />
                <span>Standard</span>
              </button>

              {/* Snow Theme */}
              <button
                onClick={() => onUpdateSettings({ theme: 'snow' })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === 'snow'
                    ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/40 font-semibold text-sky-700 dark:text-sky-300 ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Snowflake className="w-4 h-4 text-sky-400" />
                <span>Snow ❄</span>
              </button>

              {/* Light Mode */}
              <button
                onClick={() => onUpdateSettings({ theme: 'light' })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  settings.theme === 'light'
                    ? 'border-amber-500 bg-amber-50/40 font-semibold text-amber-700 ring-1 ring-amber-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Daylight</span>
              </button>
            </div>
          </div>

          {/* Garden Waste Opt-in Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Trees className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Guildford Garden Waste Subscription
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Show brown garden wheelie bin on recycling weeks
                </span>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ includeGardenWaste: !settings.includeGardenWaste })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.includeGardenWaste ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.includeGardenWaste ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Bin Day Notifications */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Bin Reminder Notifications</span>
              </div>

              <button
                onClick={handleToggleNotifications}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  settings.notificationsEnabled
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {settings.notificationsEnabled ? 'Active' : 'Turn On'}
              </button>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Receive a gentle reminder the evening before your collection so you never miss putting the bins out.
            </p>
          </div>

        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onResetSettings();
              onShowToast('Settings reset to default');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

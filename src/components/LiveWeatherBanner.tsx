import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Snowflake, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Droplets,
  Sunrise,
  Sunset
} from 'lucide-react';
import { WeatherDay } from '../types';
import { BBC_WEATHER_URL } from '../data/weather';

interface LiveWeatherBannerProps {
  weatherList: WeatherDay[];
  locationName?: string;
  lastUpdated?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const LiveWeatherBanner: React.FC<LiveWeatherBannerProps> = ({ 
  weatherList,
  locationName = 'Farnham & Guildford (GU10)',
  lastUpdated,
  isLoading = false,
  onRefresh
}) => {
  const getIcon = (iconName: WeatherDay['icon']) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'cloud-sun':
        return <CloudSun className="w-5 h-5 text-amber-400" />;
      case 'cloud':
        return <Cloud className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
      case 'rain':
      case 'cloud-rain':
        return <CloudRain className="w-5 h-5 text-sky-500 dark:text-sky-400" />;
      case 'snowflake':
        return <Snowflake className="w-5 h-5 text-sky-400 dark:text-sky-300" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      default:
        return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  const todayWeather = weatherList[0];

  return (
    <div className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs transition-colors">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {/* BBC Weather Tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 text-white font-extrabold text-[11px] tracking-wider uppercase shadow-xs">
            <span>BBC</span>
            <span className="font-semibold text-red-100">Weather</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {locationName}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Postcode GU10 (Loc 2649660)
              </span>
            </div>
            {lastUpdated && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                Updated {lastUpdated}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh BBC forecast"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          <a
            href={BBC_WEATHER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <span>bbc.co.uk/weather</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </a>
        </div>
      </div>

      {/* Today's Highlight & Collection Advisory */}
      {todayWeather && (
        <div className="my-4 p-4 sm:p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
              {getIcon(todayWeather.icon)}
            </div>
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tabular-nums">
                  {todayWeather.tempMax}°C
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                  Low: {todayWeather.tempMin}°C
                </span>
                <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">·</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {todayWeather.condition}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium leading-relaxed">
                {todayWeather.enhancedDescription || `${todayWeather.condition} with winds from the ${todayWeather.windDirection || 'east'}`}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span className="tabular-nums font-bold text-slate-900 dark:text-white">{todayWeather.pop}% Rain</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="tabular-nums font-bold text-slate-900 dark:text-white">{todayWeather.windMph} mph {todayWeather.windDirection}</span>
            </div>

            {todayWeather.sunrise && todayWeather.sunset && (
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs text-xs font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1">
                  <Sunrise className="w-3.5 h-3.5 text-amber-500" /> {todayWeather.sunrise}
                </span>
                <span className="flex items-center gap-1">
                  <Sunset className="w-3.5 h-3.5 text-indigo-400" /> {todayWeather.sunset}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collection Advisory Banner */}
      {todayWeather?.advisory && (
        <div className="mb-4 flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span><strong className="font-bold">Waste Collection Advisory:</strong> {todayWeather.advisory}</span>
        </div>
      )}

      {/* 7-Day BBC Forecast Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-1">
        {weatherList.slice(0, 7).map((w, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-between p-3 rounded-2xl text-center border transition-all ${
              index === 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/80 shadow-xs'
                : 'bg-slate-100/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {/* Header: Day & Date */}
            <div className="w-full pb-1.5 border-b border-slate-200 dark:border-slate-700/80 mb-1.5">
              <span className={`text-[11px] uppercase font-black tracking-wider block ${
                index === 0
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-800 dark:text-slate-200'
              }`}>
                {w.day}
              </span>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                {w.dateStr}
              </span>
            </div>

            {/* Weather Icon */}
            <div className="my-2">{getIcon(w.icon)}</div>

            {/* Condition Name */}
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-full px-1">
              {w.condition}
            </span>

            {/* High & Low Temp */}
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-black text-slate-950 dark:text-white tabular-nums">
                {w.tempMax}°
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                {w.tempMin}°
              </span>
            </div>

            {/* Rain % and Wind */}
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-700 dark:text-slate-300 w-full pt-1.5 border-t border-slate-200 dark:border-slate-700/80 font-bold">
              <span className="tabular-nums text-sky-700 dark:text-sky-300">
                {w.pop}%
              </span>
              <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">·</span>
              <span className="tabular-nums text-slate-700 dark:text-slate-300">
                {w.windMph}mph
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

import { WeatherDay } from '../types';

export const BBC_LOCATION_ID = '2649660';
export const BBC_WEATHER_URL = 'https://www.bbc.co.uk/weather/2649660';
export const BBC_API_DIRECT_URL = `https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/${BBC_LOCATION_ID}`;

// Map BBC Weather descriptions and codes to icon types
export function mapBbcWeatherToIcon(weatherText: string, weatherType?: number): WeatherDay['icon'] {
  const text = (weatherText || '').toLowerCase();
  
  if (text.includes('snow') || text.includes('sleet') || text.includes('blizzard') || text.includes('ice')) {
    return 'snowflake';
  }
  if (text.includes('thunder') || text.includes('heavy rain') || text.includes('torrential') || text.includes('showers')) {
    return 'cloud-rain';
  }
  if (text.includes('rain') || text.includes('drizzle')) {
    return 'rain';
  }
  if (text.includes('wind') || text.includes('gale')) {
    return 'wind';
  }
  if (text.includes('sunny') || text.includes('clear')) {
    return 'sun';
  }
  if (text.includes('partly') || text.includes('sunny intervals') || text.includes('light cloud')) {
    return 'cloud-sun';
  }
  return 'cloud';
}

// Generate smart kerbside waste advisory from BBC conditions
export function generateCollectionAdvisory(
  weatherText: string,
  maxTemp: number,
  minTemp: number,
  rainPercent: number,
  windSpeedMph: number
): string {
  if (windSpeedMph >= 22) {
    return `Breezy (${windSpeedMph}mph): Weigh down paper recycling & secure bin lids`;
  }
  if (minTemp <= 1) {
    return `Frost risk (${minTemp}°C): Ensure food caddy latch is not iced shut`;
  }
  if (rainPercent >= 70) {
    return `Wet day (${rainPercent}% rain): Keep cardboard dry inside green bin`;
  }
  if (maxTemp >= 24) {
    return `Warm weather (${maxTemp}°C): Store food waste in shaded area`;
  }
  return 'Ideal morning: Place bins at boundary line by 6:30 AM';
}

// Initial BBC snapshot for Farnham / GU10 (Location 2649660)
export const INITIAL_BBC_FORECAST: WeatherDay[] = [
  {
    day: 'TODAY',
    dateStr: '6 Nov',
    fullDate: '2026-11-06',
    tempMax: 11,
    tempMin: 4,
    condition: 'Light Cloud',
    icon: 'cloud-sun',
    pop: 10,
    windMph: 4,
    windDirection: 'E',
    enhancedDescription: 'Light cloud and light winds from the east',
    sunrise: '07:04',
    sunset: '16:29',
    advisory: 'Ideal morning: Place bins at boundary line by 6:30 AM'
  },
  {
    day: 'SAT',
    dateStr: '7 Nov',
    fullDate: '2026-11-07',
    tempMax: 10,
    tempMin: 4,
    condition: 'Fog / Mist',
    icon: 'cloud',
    pop: 12,
    windMph: 2,
    windDirection: 'NE',
    enhancedDescription: 'Early fog patches clearing to mist',
    sunrise: '07:06',
    sunset: '16:28',
    advisory: 'Calm morning: standard collection conditions'
  },
  {
    day: 'SUN',
    dateStr: '8 Nov',
    fullDate: '2026-11-08',
    tempMax: 10,
    tempMin: 2,
    condition: 'Mist',
    icon: 'cloud',
    pop: 0,
    windMph: 2,
    windDirection: 'N',
    enhancedDescription: 'Dry and calm with misty intervals',
    sunrise: '07:07',
    sunset: '16:26',
    advisory: 'Dry conditions: Put out bins Sunday evening'
  },
  {
    day: 'MON',
    dateStr: '9 Nov',
    fullDate: '2026-11-09',
    tempMax: 11,
    tempMin: 5,
    condition: 'Mist & Sunny',
    icon: 'cloud-sun',
    pop: 10,
    windMph: 10,
    windDirection: 'SW',
    enhancedDescription: 'Morning mist clearing to sunny spells',
    sunrise: '07:09',
    sunset: '16:25',
    advisory: 'Collection Day: Bins out at kerbside by 6:30 AM'
  },
  {
    day: 'TUE',
    dateStr: '10 Nov',
    fullDate: '2026-11-10',
    tempMax: 11,
    tempMin: 9,
    condition: 'Light Rain',
    icon: 'rain',
    pop: 54,
    windMph: 10,
    windDirection: 'SW',
    enhancedDescription: 'Cloudy with spells of light rain',
    sunrise: '07:11',
    sunset: '16:23',
    advisory: '54% rain chance: Keep paper recycling lids closed'
  },
  {
    day: 'WED',
    dateStr: '11 Nov',
    fullDate: '2026-11-11',
    tempMax: 13,
    tempMin: 9,
    condition: 'Rain Showers',
    icon: 'cloud-rain',
    pop: 100,
    windMph: 8,
    windDirection: 'S',
    enhancedDescription: 'Rain showers throughout the afternoon',
    sunrise: '07:13',
    sunset: '16:21',
    advisory: 'Wet day (100% rain): Ensure caddy lid is clicked shut'
  },
  {
    day: 'THU',
    dateStr: '12 Nov',
    fullDate: '2026-11-12',
    tempMax: 11,
    tempMin: 5,
    condition: 'Light Rain',
    icon: 'rain',
    pop: 91,
    windMph: 11,
    windDirection: 'W',
    enhancedDescription: 'Breezy with scattered showers',
    sunrise: '07:14',
    sunset: '16:20',
    advisory: 'Breezy and wet conditions'
  }
];

/**
 * Fetches live weather forecast directly from BBC Weather for location 2649660.
 */
export async function fetchLiveBBCWeather(): Promise<{ days: WeatherDay[]; lastUpdated: string; locationName: string }> {
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Try direct BBC CDN endpoint, then fallback proxy endpoint
  const targetUrls = [
    BBC_API_DIRECT_URL,
    '/api/bbc-weather'
  ];

  let rawData: any = null;

  for (const url of targetUrls) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        rawData = await response.json();
        break;
      }
    } catch {
      // Continue to next URL fallback
    }
  }

  if (!rawData || !Array.isArray(rawData.forecasts)) {
    return {
      days: INITIAL_BBC_FORECAST,
      lastUpdated: 'BBC Weather Feed (Cached)',
      locationName: 'Farnham & Guildford (GU10)'
    };
  }

  const locationName = rawData.location?.name || 'Farnham (GU10)';
  const lastUpdatedStr = rawData.lastUpdated 
    ? new Date(rawData.lastUpdated).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : 'Recently';

  const days: WeatherDay[] = rawData.forecasts.slice(0, 7).map((item: any, idx: number) => {
    const report = item.summary?.report || {};
    const localDate = report.localDate || '';
    const dateObj = localDate ? new Date(localDate + 'T12:00:00Z') : new Date();
    const dayLabel = idx === 0 ? 'TODAY' : daysOfWeek[dateObj.getDay()];
    const dateFormatted = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    const maxTemp = report.maxTempC ?? 11;
    const minTemp = report.minTempC ?? 4;
    const condition = report.weatherTypeText || 'Partly Cloudy';
    const pop = report.precipitationProbabilityInPercent ?? 10;
    const windMph = report.windSpeedMph ?? 6;
    const windDir = report.windDirectionAbbreviation || report.windDirection || 'E';

    return {
      day: dayLabel,
      dateStr: dateFormatted,
      fullDate: localDate,
      tempMax: maxTemp,
      tempMin: minTemp,
      condition,
      icon: mapBbcWeatherToIcon(condition, report.weatherType),
      pop,
      windMph,
      windDirection: windDir,
      sunrise: report.sunrise,
      sunset: report.sunset,
      enhancedDescription: report.enhancedWeatherDescription || report.weatherTypeText,
      advisory: generateCollectionAdvisory(condition, maxTemp, minTemp, pop, windMph)
    };
  });

  return {
    days: days.length > 0 ? days : INITIAL_BBC_FORECAST,
    lastUpdated: lastUpdatedStr,
    locationName
  };
}

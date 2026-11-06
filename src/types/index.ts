export type CollectionType = 'recycling' | 'rubbish';

export interface ScheduleEntry {
  id: string;
  date: Date;
  type: CollectionType;
  isBankHolidayShift?: boolean;
  holidayName?: string;
  bins: string[];
}

export interface WeatherDay {
  day: string;
  dateStr: string;
  fullDate?: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: 'sun' | 'cloud-sun' | 'cloud' | 'rain' | 'cloud-rain' | 'wind' | 'snowflake';
  pop: number; // Probability of precipitation %
  windMph: number;
  windDirection?: string;
  advisory?: string;
  sunrise?: string;
  sunset?: string;
  enhancedDescription?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'trade' | 'estate' | 'bulletin' | 'community';
  author: string;
  company?: string;
  contactPhone?: string;
  contactEmail?: string;
  date: string;
  content: string;
  isVerified?: boolean;
}

export interface WasteItem {
  id: string;
  name: string;
  bin: 'green' | 'black' | 'food' | 'garden' | 'special' | 'tip';
  binLabel: string;
  instructions: string;
  category: 'packaging' | 'food' | 'household' | 'garden' | 'electronics' | 'hazardous';
}

export interface AppSettings {
  collectionDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  theme: 'standard' | 'snow' | 'light';
  includeGardenWaste: boolean;
  reminderTiming: 'evening_before_7pm' | 'evening_before_8pm' | 'morning_6am';
  notificationsEnabled: boolean;
}

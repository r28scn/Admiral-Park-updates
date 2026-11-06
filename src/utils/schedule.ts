import { ScheduleEntry, CollectionType } from '../types';

export const DAY_MAP: Record<string, number> = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6
};

// Known UK Bank Holidays approximate or fixed dates for shifting detection
const BANK_HOLIDAYS_MAP: Record<string, string> = {
  '2026-12-25': 'Christmas Day',
  '2026-12-26': 'Boxing Day',
  '2026-12-28': 'Boxing Day (Substitute)',
  '2027-01-01': "New Year's Day",
  '2027-03-26': 'Good Friday',
  '2027-03-29': 'Easter Monday',
  '2027-05-03': 'Early May Bank Holiday',
  '2027-05-31': 'Spring Bank Holiday',
  '2027-08-30': 'Summer Bank Holiday'
};

export function getUpcomingSchedule(
  collectionDayName: string = 'Monday',
  includeGardenWaste: boolean = false,
  weeksCount: number = 26
): ScheduleEntry[] {
  const targetDayNum = DAY_MAP[collectionDayName] ?? 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate days until next collection
  let daysUntil = (targetDayNum - today.getDay() + 7) % 7;
  // If collection is today, keep 0
  const firstColDate = new Date(today);
  firstColDate.setDate(today.getDate() + daysUntil);

  const schedule: ScheduleEntry[] = [];
  let currentType: CollectionType = 'recycling'; // Cycle starts with Recycling

  for (let i = 0; i < weeksCount; i++) {
    const colDate = new Date(firstColDate);
    colDate.setDate(firstColDate.getDate() + i * 7);

    // Check for bank holiday shift within this week
    const dateKey = colDate.toISOString().split('T')[0];
    const holidayName = BANK_HOLIDAYS_MAP[dateKey];
    let isBankHolidayShift = false;
    let actualDate = colDate;

    if (holidayName) {
      isBankHolidayShift = true;
      actualDate = new Date(colDate);
      actualDate.setDate(colDate.getDate() + 1); // 1-day council shift
    }

    const bins = currentType === 'recycling' 
      ? ['Green Bin (Mixed Recycling)', 'Brown Food Caddy (Food Waste)']
      : ['Black Bin (General Rubbish)', 'Brown Food Caddy (Food Waste)'];

    if (includeGardenWaste && currentType === 'recycling') {
      bins.push('Brown Bin (Garden Waste)');
    }

    schedule.push({
      id: `sched-${i}-${actualDate.getTime()}`,
      date: actualDate,
      type: currentType,
      isBankHolidayShift,
      holidayName,
      bins
    });

    // Alternate every week
    currentType = currentType === 'recycling' ? 'rubbish' : 'recycling';
  }

  return schedule;
}

export function formatCollectionDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  return date.toLocaleDateString('en-GB', options);
}

export function getCountdownInfo(targetDate: Date): { text: string; days: number; isToday: boolean; isTomorrow: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    return { text: 'Today (by 6:30 AM)', days: 0, isToday: true, isTomorrow: false };
  } else if (days === 1) {
    return { text: 'Tomorrow morning', days: 1, isToday: false, isTomorrow: true };
  } else {
    return { text: `In ${days} days`, days, isToday: false, isTomorrow: false };
  }
}

/**
 * Generates and downloads an RFC 5545 .ics calendar file
 * containing the upcoming bin collections with 7 PM evening reminders.
 */
export function downloadCalendarIcs(schedule: ScheduleEntry[]) {
  const formatDateForIcs = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Admiral Park Residents//Bin Collection Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Admiral Park Bin Schedule',
    'X-WR-TIMEZONE:Europe/London'
  ];

  schedule.slice(0, 16).forEach((entry) => {
    const dtStamp = formatDateForIcs(new Date()) + 'T120000Z';
    const dateStr = formatDateForIcs(entry.date);
    const summary = entry.type === 'recycling'
      ? '♻️ Admiral Park: Green Bin (Recycling) & Food Caddy'
      : '🗑️ Admiral Park: Black Bin (Rubbish) & Food Caddy';
    
    const desc = `Bins must be at boundary line by 6:30 AM.\\nBins to put out: ${entry.bins.join(', ')}.\\nGU10 Guildford Borough Council.`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:admiral-park-${entry.id}@guildford.gov.uk`);
    lines.push(`DTSTAMP:${dtStamp}`);
    lines.push(`DTSTART;VALUE=DATE:${dateStr}`);
    lines.push(`DTEND;VALUE=DATE:${dateStr}`);
    lines.push(`SUMMARY:${summary}`);
    lines.push(`DESCRIPTION:${desc}`);
    lines.push('LOCATION:Admiral Park, GU10');
    lines.push('STATUS:CONFIRMED');
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT11H'); // Alert at ~7 PM the evening before (assuming 6 AM start)
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:Reminder: Put out ${entry.bins.join(' & ')} tonight`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  const icsContent = lines.join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'admiral-park-bin-schedule.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

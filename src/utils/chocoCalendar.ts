export interface ChocoDateInfo {
  era: string;              // "Chocolate Era"
  yearText: string;         // "Confection Year 400"
  yearShort: string;        // "CY400"
  month: string;            // "BLO", "DEW", "BEE", etc.
  monthFullName: string;     // "Blossom season 🌸", etc.
  day: string;              // "01", "02", ... "18"
  weekday: string;          // "Mossday", "Bloomday", etc.
  season: string;           // "Spring", "Summer", etc.
  seasonName: string;       // "Blossomtide", "Warmtide", etc.
  timeBell: string;         // "Sunset Bell", "Warm Sunshine", etc.
  pulse: string;            // "Cheerful 🌲", "Prosperous 🪙", etc.
  timeString: string;       // "11:23"
  fullHeaderString: string; // "Chocolate Era / Confection Year 400 / ZES 23 / Sunset Bell / Ganache Grove Pulse: Cheerful 🌲"
}

const CHOCO_WEEKDAYS = [
  'Restday',     // Sunday (0)
  'Mossday',     // Monday (1)
  'Bloomday',    // Tuesday (2)
  'Canopyday',   // Wednesday (3)
  'Lanternday',  // Thursday (4)
  'Festivalday', // Friday (5)
  'Harborday'    // Saturday (6)
];

interface ChocoMonthConfig {
  code: string;
  season: string;
  seasonName: string;
  feeling: string;
}

const CHOCO_MONTHS: ChocoMonthConfig[] = [
  { code: 'BLO', season: 'Spring', seasonName: 'Blossomtide', feeling: 'Blossom season 🌸' },
  { code: 'DEW', season: 'Spring', seasonName: 'Blossomtide', feeling: 'Morning dew 🌿' },
  { code: 'BEE', season: 'Spring', seasonName: 'Blossomtide', feeling: 'Bees and flowers 🐝' },
  { code: 'SUN', season: 'Summer', seasonName: 'Warmtide',    feeling: 'Warm sunshine ☀' },
  { code: 'HAY', season: 'Summer', seasonName: 'Warmtide',    feeling: 'Harvest fields 🌾' },
  { code: 'ZES', season: 'Summer', seasonName: 'Warmtide',    feeling: 'Zesty fruits 🍋' },
  { code: 'RAY', season: 'Autumn', seasonName: 'Harvesttide', feeling: 'Golden rays 🍂' },
  { code: 'NUT', season: 'Autumn', seasonName: 'Harvesttide', feeling: 'Nuts and cocoa harvest 🌰' },
  { code: 'MAP', season: 'Autumn', seasonName: 'Harvesttide', feeling: 'Maple leaves 🍁' },
  { code: 'FRO', season: 'Winter', seasonName: 'Frosttide',   feeling: 'Frost arrives ❄' },
  { code: 'SNO', season: 'Winter', seasonName: 'Frosttide',   feeling: 'Snow season ⛄' },
  { code: 'EVE', season: 'Winter', seasonName: 'Frosttide',   feeling: 'Festive evenings 🕯' }
];

export function getChocoDate(d?: Date): ChocoDateInfo {
  const dt = d || new Date();
  
  // Weekday
  const dayOfWeek = dt.getDay();
  const weekday = CHOCO_WEEKDAYS[dayOfWeek] || 'Restday';

  // Month & Season (0-indexed in JS)
  const monthIdx = dt.getMonth();
  const monthConfig = CHOCO_MONTHS[monthIdx] || CHOCO_MONTHS[0];
  const month = monthConfig.code;
  const monthFullName = monthConfig.feeling;
  const season = monthConfig.season;
  const seasonName = monthConfig.seasonName;

  // Day of Month padded
  const dayVal = dt.getDate();
  const day = dayVal.toString().padStart(2, '0');

  // Time Bell (based on hours)
  const hour = dt.getHours();
  let timeBell: string;
  if (hour >= 0 && hour < 5) {
    timeBell = 'Midnight Bell';
  } else if (hour >= 5 && hour < 9) {
    timeBell = 'Sunrise Bell';
  } else if (hour >= 9 && hour < 12) {
    timeBell = 'Morning Bell';
  } else if (hour >= 12 && hour < 17) {
    timeBell = 'Warm Sunshine';
  } else if (hour >= 17 && hour < 21) {
    timeBell = 'Sunset Bell';
  } else {
    timeBell = 'Curfew Bell';
  }

  // Pulse (Rotates according to the ChocoBrook Weekday)
  let pulse = 'Cheerful 🌲';
  switch (weekday) {
    case 'Mossday':
      pulse = 'Resourceful 🪵';
      break;
    case 'Bloomday':
      pulse = 'Cheerful 🌸';
      break;
    case 'Canopyday':
      pulse = 'Adventurous 🌲';
      break;
    case 'Lanternday':
      pulse = 'Mysterious 🕯️';
      break;
    case 'Festivalday':
      pulse = 'Festive 🎈';
      break;
    case 'Harborday':
      pulse = 'Busy ⚓';
      break;
    case 'Restday':
      pulse = 'Cozy 🍯';
      break;
  }

  // Formatting hours/minutes for raw clock display
  const minutes = dt.getMinutes().toString().padStart(2, '0');
  const timeString = `${hour.toString().padStart(2, '0')}:${minutes}`;

  // Full formatted header string
  const fullHeaderString = `Chocolate Era / Confection Year 400 / ${month} ${day} / ${timeBell} / Ganache Grove Pulse: ${pulse}`;

  return {
    era: 'Chocolate Era',
    yearText: 'Confection Year 400',
    yearShort: 'CY400',
    month,
    monthFullName,
    day,
    weekday,
    season,
    seasonName,
    timeBell,
    pulse,
    timeString,
    fullHeaderString
  };
}

/** Formats a date into "BEE 07, CY400 / Warm Sunshine" or similar */
export function formatChocoShort(d?: Date): string {
  const info = getChocoDate(d);
  return `${info.month} ${info.day}, ${info.yearShort} / ${info.timeBell}`;
}

/** Formats a date to include the season and bell for logs */
export function formatChocoJournal(d?: Date): string {
  const info = getChocoDate(d);
  return `${info.seasonName} / ${info.timeBell} / ${info.yearText}`;
}

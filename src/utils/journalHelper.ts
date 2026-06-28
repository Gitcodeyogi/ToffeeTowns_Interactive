export interface JournalEntry {
  dayNumber: number;
  completedPhases: string[];
  coinsEarned: number;
  legacyEarned: number;
  memorableEvent: string;
}

export function updateResidentJournal(
  action: 'stamp' | 'briefing' | 'vote' | 'riddle' | 'dispatch' | 'chore',
  details: {
    coins?: number;
    legacy?: number;
    phaseName?: string;
    description?: string;
  }
) {
  const todayStr = new Date().toISOString().slice(0, 10);
  
  let journal: Record<string, JournalEntry> = {};
  const saved = localStorage.getItem('tt_resident_journal');
  if (saved) {
    try {
      journal = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse resident journal entries', e);
    }
  }

  const existingEntry = journal[todayStr];
  const coins = details.coins || 0;
  const legacy = details.legacy || 0;
  const phase = details.phaseName || action;

  if (existingEntry) {
    // Update existing entry
    if (phase && !existingEntry.completedPhases.includes(phase)) {
      existingEntry.completedPhases.push(phase);
    }
    existingEntry.coinsEarned += coins;
    existingEntry.legacyEarned += legacy;
    
    // Update memorableEvent to compile multiple actions
    if (details.description) {
      if (existingEntry.memorableEvent.includes(details.description)) {
        // Already recorded
      } else {
        const cleanedEvent = existingEntry.memorableEvent.trim().replace(/\.$/, '');
        existingEntry.memorableEvent = `${cleanedEvent}, and ${details.description.toLowerCase()}.`;
      }
    }
  } else {
    // Create new entry
    const dayNumber = Object.keys(journal).length + 1;
    const desc = details.description || `Spent time in Ganache Grove completing tasks.`;
    journal[todayStr] = {
      dayNumber,
      completedPhases: phase ? [phase] : [],
      coinsEarned: coins,
      legacyEarned: legacy,
      memorableEvent: desc
    };
  }

  localStorage.setItem('tt_resident_journal', JSON.stringify(journal));
}

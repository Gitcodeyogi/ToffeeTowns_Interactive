export interface ThemeConfig {
    text: string;
    textStrong: string;
    textSoft: string;
    hex: string;
    border: string;
    glow: string;
    shadow: string;
    bg: string;
    bgStrong: string;
}

export const ZONE_THEMES: Record<number, ThemeConfig> = {
    1: { text: 'text-amber-300', textStrong: 'text-amber-200', textSoft: 'text-amber-400', hex: '#fbbf24', border: 'border-amber-400/50', glow: 'from-amber-400/40 to-emerald-500/20', shadow: 'shadow-amber-400/40', bg: 'bg-gradient-to-br from-amber-500/10 to-emerald-500/10', bgStrong: 'bg-amber-400' },
    2: { text: 'text-sky-300', textStrong: 'text-cyan-200', textSoft: 'text-sky-400', hex: '#38bdf8', border: 'border-sky-400/50', glow: 'from-sky-400/40 to-teal-500/20', shadow: 'shadow-sky-400/40', bg: 'bg-gradient-to-br from-sky-500/10 to-teal-500/10', bgStrong: 'bg-sky-400' },
    3: { text: 'text-emerald-300', textStrong: 'text-lime-300', textSoft: 'text-emerald-400', hex: '#34d399', border: 'border-emerald-400/50', glow: 'from-emerald-400/40 to-cyan-500/20', shadow: 'shadow-emerald-400/40', bg: 'bg-gradient-to-br from-emerald-500/10 to-cyan-500/10', bgStrong: 'bg-emerald-400' },
    4: { text: 'text-fuchsia-300', textStrong: 'text-violet-300', textSoft: 'text-fuchsia-400', hex: '#d946ef', border: 'border-fuchsia-400/50', glow: 'from-fuchsia-400/40 to-rose-500/20', shadow: 'shadow-fuchsia-400/40', bg: 'bg-gradient-to-br from-fuchsia-500/10 to-rose-500/10', bgStrong: 'bg-fuchsia-400' },
    5: { text: 'text-rose-400', textStrong: 'text-rose-300', textSoft: 'text-rose-500', hex: '#fb7185', border: 'border-rose-400/50', glow: 'from-rose-400/40 to-black/30', shadow: 'shadow-rose-400/40', bg: 'bg-gradient-to-br from-rose-500/10 to-black/20', bgStrong: 'bg-rose-400' },
};

export const getZoneTheme = (zoneNumber: number): ThemeConfig => {
    return ZONE_THEMES[zoneNumber] || ZONE_THEMES[1];
};

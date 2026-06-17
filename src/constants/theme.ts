/* eslint-disable no-useless-escape */
// Centralized theme tokens and CSS variables for the app
export const THEME_CSS = `:root{
    --ulitp-blue: #2563EB;
    --ulitp-green: #10B981;
    --ulitp-yellow: #F59E0B;
    --ulitp-pink: #EC4899;
    --ulitp-orange: #FB923C;
    --text-accent-rgb: 37,99,235; /* rgb(37,99,235) - ulitp-blue */

    --bg-glass: rgba(0,0,0,0.2);
    --panel-border: rgba(255,255,255,0.08);
    --panel-glow: rgba(255,255,255,0.05);
}

/* Convenience helper utilities mapped to theme variables so existing components
    that reference bg-ulitp-* or text-ulitp-* keep working without changing
    many files. These are minimal and intended to bridge to the centralized tokens. */
.bg-ulitp-blue { background-color: var(--ulitp-blue) !important; }
.bg-ulitp-green { background-color: var(--ulitp-green) !important; }
.bg-ulitp-yellow { background-color: var(--ulitp-yellow) !important; }
.bg-ulitp-pink { background-color: var(--ulitp-pink) !important; }
.bg-ulitp-orange { background-color: var(--ulitp-orange) !important; }

.text-ulitp-blue { color: var(--ulitp-blue) !important; }
.text-ulitp-green { color: var(--ulitp-green) !important; }
.text-ulitp-yellow { color: var(--ulitp-yellow) !important; }
.text-ulitp-pink { color: var(--ulitp-pink) !important; }
.text-ulitp-orange { color: var(--ulitp-orange) !important; }

.ring-text-accent { box-shadow: 0 0 0 4px rgba(var(--text-accent-rgb), 0.15) !important; }

/* Simple helpers for translucent variants used in a few components */
.bg-ulitp-blue\/60 { background-color: rgba(37,99,235,0.6) !important; }
.bg-ulitp-green\/80 { background-color: rgba(16,185,129,0.8) !important; }
.bg-ulitp-yellow\/80 { background-color: rgba(245,158,11,0.8) !important; }
.bg-ulitp-pink\/60 { background-color: rgba(236,72,153,0.6) !important; }
.bg-ulitp-orange\/60 { background-color: rgba(251,146,60,0.6) !important; }

/* RGB helpers for translucent helpers */
:root{
    --ulitp-blue-rgb: 37,99,235;
    --ulitp-green-rgb: 16,185,129;
    --ulitp-yellow-rgb: 245,158,11;
    --ulitp-pink-rgb: 236,72,153;
    --ulitp-orange-rgb: 251,146,60;
}

/* Backwards-compatibility mappings for common Tailwind color names used across the codebase */
.text-emerald-400 { color: var(--ulitp-green) !important; }
.text-emerald-500 { color: var(--ulitp-green) !important; }
.bg-emerald-500\/5 { background-color: rgba(var(--ulitp-green-rgb),0.05) !important; }
.bg-emerald-500\/20 { background-color: rgba(var(--ulitp-green-rgb),0.2) !important; }
.text-pink-400 { color: var(--ulitp-pink) !important; }
.bg-pink-500\/5 { background-color: rgba(var(--ulitp-pink-rgb),0.05) !important; }
.text-blue-500 { color: var(--ulitp-blue) !important; }
.bg-blue-500\/60 { background-color: rgba(var(--ulitp-blue-rgb),0.6) !important; }
.text-yellow-400 { color: var(--ulitp-yellow) !important; }
.bg-yellow-400\/80 { background-color: rgba(var(--ulitp-yellow-rgb),0.8) !important; }
.text-red-600 { color: #dc2626 !important; }
.bg-red-600\/20 { background-color: rgba(220,38,38,0.2) !important; }

/* Generic small helpers */
.text-white\/70 { color: rgba(255,255,255,0.7) !important; }
.text-white\/40 { color: rgba(255,255,255,0.4) !important; }
.bg-black\/60 { background-color: rgba(0,0,0,0.6) !important; }
.bg-black\/40 { background-color: rgba(0,0,0,0.4) !important; }

`;

/* Spacing and layout utilities */
export const SPACING_CSS = `
/* Base spacing scale (can be adjusted centrally) */
:root{
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.5rem;
    --space-6: 2rem;
}

.p-base { padding: var(--space-4) !important; }
.px-base { padding-left: var(--space-4) !important; padding-right: var(--space-4) !important; }
.py-base { padding-top: var(--space-4) !important; padding-bottom: var(--space-4) !important; }
.pt-base { padding-top: var(--space-4) !important; }
.pb-base { padding-bottom: var(--space-4) !important; }
.gap-base { gap: var(--space-4) !important; }

.container { width: 100%; max-width: 1200px; margin-left: auto; margin-right: auto; padding-left: var(--space-4); padding-right: var(--space-4); }

`;

/* Typography and text tokens */
export const TYPO_CSS = `:root{
    --font-brand: 'Luckiest Guy', cursive;
    --font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    --font-title-weight: 800;
    --font-body-weight: 400;
    --text-primary: rgba(255,255,255,0.95);
    --text-secondary: rgba(255,255,255,0.75);
    --text-muted: rgba(255,255,255,0.45);
}

.font-brand { font-family: var(--font-brand); }
.font-title { font-family: var(--font-body); font-weight: var(--font-title-weight); }
.font-body  { font-family: var(--font-body); font-weight: var(--font-body-weight); }
.text-text-primary { color: var(--text-primary) !important; }
.text-text-secondary { color: var(--text-secondary) !important; }
.text-text-muted { color: var(--text-muted) !important; }
.bg-bg-secondary { background-color: rgba(255,255,255,0.03) !important; }

`;

export const DEFAULT_THEME = {
    name: 'default',
    colors: {
        blue: 'var(--ulitp-blue)',
        green: 'var(--ulitp-green)',
        yellow: 'var(--ulitp-yellow)',
        pink: 'var(--ulitp-pink)',
        orange: 'var(--ulitp-orange)'
    }
};

export default DEFAULT_THEME;

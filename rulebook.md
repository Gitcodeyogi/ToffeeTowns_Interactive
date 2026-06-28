# Toffee Towns Design Rulebook

This rulebook defines the strict UI and layout standards for Toffee Towns Interactive to ensure a premium, modern, and visually stunning user experience.

---

## 📐 1. Panel & Page Dimensions

### Standard Pages (Main Workspaces)
* **Glass Panel Dimensions**:
  - When website header is visible: Strictly `92vw` width by `92vh` height (`w-[92vw] h-[92vh]`).
  - When website header is hidden: Strictly `92vw` width by `96vh` height (`w-[92vw] h-[96vh]`).
* **Visual Structure**: Fit within the screen height boundaries; scrollbars must be internal to components to prevent double scrollbars.
* **Layout**: Clean grid or flex structures to show contents beautifully.

### Pop-up Overlays (Modals)
* **Popup Dimensions**: Strictly `85vw` width by `85vh` height (`w-[85vw] h-[85vh]`).
* **Standalone Presentation**: All pop-ups must be **completely standalone**. When a pop-up is active, the underlying page/workspace panel must NOT be visible. Only the background wallpaper (`BgCanvas`) should show behind the pop-up.
* **Backdrop Overlay**: The overlay backdrop behind pop-ups must be extremely light or transparent (`bg-black/10` or `bg-transparent`) with **no backdrop blur** so the background wallpaper remains visible in its original brightness.
* **Popup Content Panels**:
  - Image panel/slot: Must show at full/original brightness (no dark overlay layers, color tint multiply layers, or vignettes are allowed). Use floating translucent panels for captions.
  - Text pane: Keep at exactly `60%` darkness (`bg-black/60` or equivalent).

---

## 🎨 2. Aesthetics & Styling

### Backgrounds & Borders
* **Standard Panel Background**: `bg-black/60` (semi-translucent dark glassmorphism).
* **Blur Effects**: No CSS backdrop blurs are allowed on overlays or main panels (`backdrop-blur-none` or subtle `backdrop-blur-sm` where required) to preserve desktop wallpaper visibility.
* **Borders**: Soft thin borders with light opacity (`border border-white/10` or `border border-white/15`).
* **Border Radius**: Sleek rounded corners (`rounded-[2.5rem]` or `rounded-[2rem]`).
* **Height Uniformity**: All container boxes on the home dashboard must have identical uniform sizing (`lg:h-[410px]` on desktop).
* **Image Slots in Boxes**: Left image/cover slots must have a fully dark background (`bg-black`) and use full-scale edge-to-edge images (`object-cover`).

### Images & Illustrations
* **Layout Standard**: All visuals on split panels and pop-ups must use a **3:2 horizontal image slot** as standard.
* **Image Container**: Must be strictly bounded.
* **No Distortion or Cropping**: Image rendering must avoid ugly cropping, overshadowing, or overflowing. Use `object-contain` or bounded aspect ratios where appropriate to show the complete lovely illustrations without clipping important parts.

---

## 📝 3. Content Copy & Typography

### Summary Guides
* **3-Line Introduction**: Every workspace section and modal/pop-up must open with a clear, concise **3-line header description** explaining what it is and what actions the resident should take.
* **Action Items**: Below the 3-line guide, clear pointers or action lists should guide the user.
* **Forbidden Terminology**: Avoid the word **"dispatch"** or **"despatch"** in the interface copy. Replace all occurrences with "bulletin", "activities", "chores", or "chores bulletin".

---

## 🛠️ 4. Developer Version & Production TODO Checklist

This codebase currently runs a **Developer Version** which contains sandbox and convenience testing layers that must be disabled, replaced, or removed before releasing to production.

### Required Actions for Production Build:
1. **Remove Dev Coin Clamp Hook**:
   - Locate the `devSet` wrapper in [useTTStore.ts](file:///c:/Yogesh%20Universe/TOFFEETOWNS_FUN/src/store/useTTStore.ts) which automatically resets the coins to `500` for users with name/email matching `yogesh`, `yoges`, or when running on `localhost`.
   - Remove this clamp to ensure real coin deductions are correctly persisted without developer overrides.
2. **Replace Mock Payment Gateways**:
   - Replace any simulated coin/gem purchase overlays with official production SDKs (e.g., Stripe, Google Play Billing, or App Store Kit) and update transaction webhooks.
   - Enforce server-side security checks for premium citizen passes and direct gem deposits.
3. **Toggle Environment Configuration**:
   - Ensure all `import.meta.env.MODE` configurations are locked to `production`.
   - Disable any local test news dispatches, mock encounter triggers, or bypass buttons in the Residency Modal riddle questions.

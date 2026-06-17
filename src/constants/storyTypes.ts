// ============================================================
// STORY TYPES — Shared types for the Drama Stage (SparrowXTheatre)
// World 1 = Stories Page (discovery/preview)
// World 2 = Drama Stage (full cinematic story)
// These types connect the two worlds.
// ============================================================

/** One dialogue line on a scene — maps to scene.dialogues[] in SparrowXTheatre */
export interface SceneDialogue {
    speaker: string;   // Character name shown above the line
    text: string;      // The actual dialogue line
}

/**
 * One scene/slide = one image + optional title + synopsis + dialogue lines.
 * imageUrl: Firebase Storage URL in production, local path in dev.
 * Replace local paths with Firebase URLs as you upload illustrations.
 */
export interface StoryScene {
    /** Firebase URL (prod) or local path (dev).
     *  Example prod: 'https://firebasestorage.googleapis.com/v0/b/.../legend-01.png?alt=media&token=...'
     *  Example dev:  '/assets/stories/toffee-town/legend/01.png'
     */
    imageUrl: string;
    /** Short scene title shown in the theatre header (e.g. 'Scene 01 — The Barren Plains') */
    title?: string;
    /** Brief scene description shown in the Synopsis panel */
    description?: string;
    /** One or more dialogue lines shown in the Script panel */
    dialogues: SceneDialogue[];
}

/** One lens story = title + description + up to 25 scenes */
export interface LensStory {
    /** Displayed in the theatre header e.g. 'The First Spark of the Fountain' */
    title: string;
    /** Full synopsis shown in the Read Synopsis panel */
    description: string;
    /** Up to 25 scenes. Each scene = one image + dialogue(s). */
    scenes: StoryScene[];
}

/** All 5 lens stories for one town */
export interface TownStories {
    legend:    LensStory;
    gossip:    LensStory;
    politics:  LensStory;
    economy:   LensStory;
    transport: LensStory;
}

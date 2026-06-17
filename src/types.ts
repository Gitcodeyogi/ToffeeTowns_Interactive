/* eslint-disable @typescript-eslint/no-namespace */
import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        [elemName: string]: any;
      }
    }
  }
}

export type Theme = 'nature' | 'city' | 'ocean' | 'space' | 'burger' | 'serene-forest' | 'mountain-mist' | 'golden-canyon' | 'wooden-flowers' | 'leaf-at-night' | 'kittle-chickens' | 'colorful-donuts' | 'elephants-mist' | 'morning-brightness' | 'default' | 'start' | 'modern' | 'neon' | 'dark-matter' | 'nebula' | 'supernova' | 'black-hole' | 'holographic';

export type Page =
  | 'landing'
  | 'desk'
  | 'synopsis'
  | 'story-chapters'
  | 'characters'
  | 'story'
  | 'games-arena'
  | 'about-us'
  | 'feedback'
  | 'leaderboard'
  | 'coin-store'
  | 'chuckle-memory'
  | 'chuckle-town'
  | 'chuckle-tycoon'
  | 'chuckle-kingdom'
  | 'chuckle-debate'
  | 'chuckle-mojo'
  | 'town-connect'
  | 'admin-dashboard'
  | 'whats-next'
  | 'future-adventures'
  | 'game-landing'
  | 'badges'
  | 'gallery-3d'
  | 'sparrow-theatre'
  | 'town-theatre'
  | 'settings'
  | 'login'
  | 'audit'
  | 'user-profile'
  | 'archives'
  | 'all-pages'
  | 'help'
  | 'dummy'
  | 'imperial-record'
  | 'town-chase';

export interface PageVersion {
  timestamp: string;
  description: string;
  state: string; // Serialized relevant state
}

export interface TitlePageContent {
  title: string;
  subtitle: string;
  author: string;
  imageUrls: string[];
  adventureImages?: string[];
}

export interface Dialogue {
  id: string;
  speaker: string;
  text: string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
}

export interface Scene {
  id: number;
  title: string;
  caption: string;
  text: string;
  imageUrl: string;
  dialogues?: Dialogue[];
  narrativeFont?: string;
  narrativeColor?: string;
  narrativeSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export interface CharacterStats {
  strength: number;
  agility: number;
  intellect: number;
  mischief: number;
  kindness: number;
  wit: number;
  courage: number;
  humor: number;
  luck: number;
}

export interface Character {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  team: 'bosses' | 'rebels' | 'neutral';
  icon: string;
  isFeatured?: boolean;
  stats?: CharacterStats;
  universeId?: string;
  role?: string;
  style?: any;
  loreSections?: Array<{ title: string; content: string; image?: string }>;
}

export interface Adventure {
  id: number;
  title: string;
  description: string;
  teaserHook?: string; // One-sentence cinematic hook
  coverImage: string;
  isLocked: boolean;
  style?: any;
}

export type SaveState = 'idle' | 'saving' | 'saved' | 'error' | 'uploading';

export interface GameProgress {
  unlockedLevel: number;
  highScores: Record<number, number>;
}

export interface UserScores {
  chuckleMemory: GameProgress;
  chuckleTown: GameProgress;

  chuckleTycoon: GameProgress;
  chuckleKingdom: GameProgress;
  chuckleDebate: GameProgress;
  chuckleMojo: GameProgress;
  townConnect: GameProgress;
  townChase?: GameProgress;
  townStruggle?: GameProgress;
}

export interface CoinTransaction {
  id: string;
  date: string;
  amount: number;
  source: string;
  type: 'earned' | 'spent';
}

export interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  requirement: string;
  category: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface FontSettings {
  title: string;
  body: string;
  brand: string;
}

export interface ButtonSettings {
  fontFamily: string;
  transparency: number; // 0-100
  fontSizeBase: number; // in px
  primaryColor: string; // Tailwind-like or hex
  secondaryColor: string;

  // Premium Granular Controls
  gradientStart?: string;
  gradientEnd?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number; // px
  shineEffect?: boolean;
  shadowIntensity?: number; // 0-100
  bevel?: boolean;
  textColor?: string;
  textShadow?: boolean;
  startIcon?: string;
  endIcon?: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  isAdmin?: boolean;
  isPro?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'reward' | 'alert';
}

export interface UserFeedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  read: boolean;
}

export interface GameAssets {
  bgImage?: string;
}

export interface PurchasableItem {
  type: 'story_access' | 'coins';
  price: number;
  description: string;
  priceId?: string;
  amount?: number;
}

export type TalkCategory = 'excellent' | 'good' | 'fair' | 'quit' | 'gameover' | 'tip' | 'login';
export type GameContext = 'general' | 'memory' | 'puzzle' | 'riddle' | 'strategy' | 'bubble' | 'runner' | 'ninja' | 'town' | 'tycoon';

export interface PaymentRequest {
  uid: string;
  amount: number;
  currency: string;
  paymentMethod: 'google_pay';
  token: string;
  status: 'pending' | 'succeeded' | 'approved' | 'failed';
  error?: { message: string };
  createdAt: string;
}

export interface PageShadeSettings {
  shadeColor: 'pink' | 'green' | 'yellow' | 'black' | 'blue' | 'purple' | 'cyan' | 'orange' | 'teal' | 'red';
  shadeMode?: 'dark' | 'light' | 'teal';
  brightness: number; // 0-100
  // Header Customization
  sparrowColor?: string;
  xColor?: string;
  subTitleColor?: string;
  stripeColor?: string;

  // Typography Overrides
  headingFont?: string;
  headingSize?: number; // scale factor or px
  headingColor?: string;
  headingCase?: 'uppercase' | 'normal' | 'capitalize';

  descFont?: string;
  descSize?: number;
  descColor?: string;
  descItalic?: boolean;

  // Glass Styling
  glassOpacity?: number;
  glassBlur?: number;
  glassPanelOpacity?: number; // Description panel transparency (0-100)
  glassTint?: string; // Glass panel tint color
  glassBorder?: number; // Glass border strength (0-100)

  // Nav Styling (Header/Footer)
  navShadeColor?: string; // Header/footer shade color
  navTransparency?: number; // Header/footer transparency (0-100)

  // Game Modal Styling
  modalTransparency?: number; // Modal background transparency (20-80)
  modalShadeColor?: 'pink' | 'green' | 'yellow' | 'black' | 'blue' | 'purple' | 'cyan' | 'orange' | 'teal' | 'red';
  modalTextScale?: number; // Text size scale (80-120)

  // Content Overrides
  customTitle?: string;
  customDescription?: string;
  customButtonText?: string;
  backButtonText?: string;

  // Custom Text Fields
  customHeroTitle?: string;
  customHeroDescription?: string;
  customCardHeading?: string;
  customFooterText?: string;

  // Granular Layout Controls
  gridColumns?: number;
  cardScale?: number;
  showAllFilter?: boolean;
  scriptOpacity?: number;
  stageGlow?: number;

  heroSettings?: {
    height?: number; // vh
    autoPlayInterval?: number; // ms
    opacity?: number; // 0-100
    overlayGradient?: boolean;
    showArrows?: boolean;
    showDots?: boolean;
  };

  contentSettings?: {
    cardBorderRadius?: number; // px
    cardShadowIntensity?: number; // 0-100
    cardBorderWidth?: number; // px
    cardGap?: number; // px
  };

  // Granular Word Styling (Index -> Style)
  wordStyles?: Record<number, {
    color?: string;
    size?: number; // relative percent e.g. 110 or 90
    italic?: boolean;
    bold?: boolean;
    font?: string;
  }>;
  // Legacy wordColors fallback
  wordColors?: Record<number, string>;

  // Body Typography Granularity
  sectionTitleSettings?: {
    font?: string;
    size?: number;
    color?: string;
    case?: 'uppercase' | 'capitalize' | 'normal';
  };
  cardTitleSettings?: {
    font?: string;
    size?: number;
    color?: string;
  };
}

export interface GlobalSettings {
  maintenanceMode: boolean;
  minVersion: string;
  announcement?: string;
  welcomeImage?: string;
}

export interface UserStoryState {
  scenes: Scene[];
  currentStoryIndex: number;
  unlockedScenes: number[];
  chuckleCoins: number;
  userScores: UserScores;
  inventory: string[];
  isGuest: boolean;
  createdAt: string;
  lastLoginDate: string | null;
  streakCount: number;
  advisorPaymentStatus?: { isPaid: boolean; freeChatsLeft: number; expiryTimestamp: number };
  pendingTaxRefunds?: { amount: number; incident: string }[];
  theatreProgress?: Record<string, number>;
  unlockedTheatreStories?: Record<string, number>;
  paidSessionTolls?: string[];
  pageBackgrounds?: Record<string, string>;
  pageBackgroundImages?: Record<string, string[]>;
  pageBackgroundRotationSeconds?: Record<string, number>;
  pageShadeSettings?: Record<string, PageShadeSettings>;
  themeBackgroundImages?: Record<string, string[]>;
  characters: Character[];
  adventures: Adventure[];
  synopsis: string;
  selectedUniverse: string;
  areScenesUnlocked: boolean;
  titlePageContent?: TitlePageContent;
  actCoverImages?: Record<string, string>;
  fontSettings?: FontSettings;
  buttonSettings?: ButtonSettings;
  // Game Economy & Progress
  totalPointsRewarded?: number;
  coinHistory?: CoinTransaction[];
  earnedBadges?: number[];
  unseenBadges?: number[];
  seenGameInstructions?: string[];
  themeGlassSettings?: Record<string, { color: string; opacity: number; blur: number }>;
  lastProvinceTaxTriggerTime?: number;
  provinceVisitCounter?: number;
  visitCounter?: number;
  
  // Living Province State fields
  mattersRequiringAttention?: any[];
  provincialMailbox?: any[];
  provinceTimeline?: any[];
  dailyHeadline?: any;
  travellerLegacyTitles?: string[];
  travellerLegacy?: number;
  professionLegacy?: Record<string, number>;
  homeTown?: string | null;
  currentDestination?: string | null;
}

export type BackendResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

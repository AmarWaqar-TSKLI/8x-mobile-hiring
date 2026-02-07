/**
 * Profile — shared constants, types & mock data
 *
 * Everything the profile section needs lives here:
 * colour tokens, user data, achievements, portfolio items,
 * brand partnerships, settings structure, and analytics.
 */
import { Dimensions } from 'react-native';

export const { width: SW, height: SH } = Dimensions.get('window');

/* ── colour tokens ────────────────────────────────────────────────────── */
export const C = {
  bg:        '#FAFAFA',
  surface:   '#FFFFFF',
  ink:       '#0A2540',
  inkSoft:   '#425466',
  muted:     '#6B7C93',
  subtle:    '#C1C9D2',
  border:    '#E6EBF1',
  accent:    '#635BFF',
  accentBg:  '#F0EEFF',
  accentAlt: '#00D4AA',
  orange:    '#FF7A00',
  pink:      '#FF3CAC',
  greenBg:   '#E8FBF5',
  greenText: '#00B386',
  danger:    '#FF4757',
  gold:      '#FFB800',
  goldBg:    '#FFF8E6',
  shimmer1:  '#F0F0F0',
  shimmer2:  '#E0E0E0',
  overlay:   'rgba(10, 37, 64, 0.55)',
};

/* ── types ────────────────────────────────────────────────────────────── */
export interface ProfileData {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  niche: string[];
  verified: boolean;
  joinedDate: string;
  followers: number;
  following: number;
  totalContent: number;
  website?: string;
}

export interface PortfolioItem {
  id: string;
  thumbnail: string;
  views: number;
  likes: number;
  duration: string;
  isPinned: boolean;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  progress: number;    // 0–1
  unlocked: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface BrandPartner {
  id: string;
  name: string;
  logo: string;        // URL
  initial: string;
  color: string;
  campaigns: number;
  earned: number;
  status: 'active' | 'completed' | 'invited';
}

export interface AnalyticsSnapshot {
  label: string;
  value: string;
  change: number;         // percentage, positive = growth
  sparkline: number[];    // last 7 data points
}

export interface SettingItem {
  id: string;
  icon: string;
  label: string;
  type: 'navigation' | 'toggle' | 'badge';
  value?: boolean;
  badgeText?: string;
  danger?: boolean;
}

/* ── helpers ──────────────────────────────────────────────────────────── */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function tierColor(tier: Achievement['tier']): string {
  switch (tier) {
    case 'bronze':   return '#CD7F32';
    case 'silver':   return '#A8A9AD';
    case 'gold':     return '#FFB800';
    case 'platinum': return '#635BFF';
  }
}

export function tierBg(tier: Achievement['tier']): string {
  switch (tier) {
    case 'bronze':   return '#FFF0E0';
    case 'silver':   return '#F4F4F5';
    case 'gold':     return '#FFF8E6';
    case 'platinum': return '#F0EEFF';
  }
}

/* ── mock profile ─────────────────────────────────────────────────────── */
export const PROFILE: ProfileData = {
  name: 'Jane Doe',
  handle: '@janedoe',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  bio: 'Lifestyle creator | Fitness enthusiast | Brand storyteller.\nTurning everyday moments into scroll-stopping content.',
  location: 'Los Angeles, CA',
  niche: ['Fitness', 'Lifestyle', 'Beauty'],
  verified: true,
  joinedDate: '2025-06-15',
  followers: 24800,
  following: 312,
  totalContent: 48,
  website: 'janedoe.co',
};

/* ── portfolio (top performing content) ───────────────────────────────── */
export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    views: 22100,
    likes: 1870,
    duration: '0:32',
    isPinned: true,
  },
  {
    id: 'p2',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    views: 15200,
    likes: 1100,
    duration: '0:58',
    isPinned: true,
  },
  {
    id: 'p3',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    views: 12400,
    likes: 843,
    duration: '1:35',
    isPinned: false,
  },
  {
    id: 'p4',
    thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
    views: 8700,
    likes: 621,
    duration: '0:45',
    isPinned: false,
  },
  {
    id: 'p5',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    views: 6200,
    likes: 490,
    duration: '1:12',
    isPinned: false,
  },
  {
    id: 'p6',
    thumbnail: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80',
    views: 5300,
    likes: 389,
    duration: '0:55',
    isPinned: false,
  },
];

/* ── achievements / badges ────────────────────────────────────────────── */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    icon: '🔥',
    title: 'Rising Star',
    description: 'Reach 10K total views',
    progress: 1,
    unlocked: true,
    tier: 'gold',
  },
  {
    id: 'a2',
    icon: '🤝',
    title: 'Brand Magnet',
    description: 'Complete 5 brand campaigns',
    progress: 0.8,
    unlocked: false,
    tier: 'silver',
  },
  {
    id: 'a3',
    icon: '🎬',
    title: 'Content Machine',
    description: 'Upload 50 videos',
    progress: 0.96,
    unlocked: false,
    tier: 'gold',
  },
  {
    id: 'a4',
    icon: '💰',
    title: 'First Thousand',
    description: 'Earn $1,000 from campaigns',
    progress: 1,
    unlocked: true,
    tier: 'platinum',
  },
  {
    id: 'a5',
    icon: '⭐',
    title: 'Engagement Pro',
    description: 'Maintain 5%+ engagement rate',
    progress: 1,
    unlocked: true,
    tier: 'bronze',
  },
];

/* ── brand partnerships ───────────────────────────────────────────────── */
export const BRAND_PARTNERS: BrandPartner[] = [
  {
    id: 'b1',
    name: 'Nike',
    logo: '',
    initial: 'N',
    color: '#111111',
    campaigns: 3,
    earned: 750,
    status: 'active',
  },
  {
    id: 'b2',
    name: 'Glossier',
    logo: '',
    initial: 'G',
    color: '#F5C6D0',
    campaigns: 2,
    earned: 500,
    status: 'active',
  },
  {
    id: 'b3',
    name: 'Airbnb',
    logo: '',
    initial: 'A',
    color: '#FF5A5F',
    campaigns: 1,
    earned: 350,
    status: 'completed',
  },
  {
    id: 'b4',
    name: 'Samsung',
    logo: '',
    initial: 'S',
    color: '#1428A0',
    campaigns: 0,
    earned: 0,
    status: 'invited',
  },
];

/* ── analytics snapshot ───────────────────────────────────────────────── */
export const ANALYTICS: AnalyticsSnapshot[] = [
  {
    label: 'Impressions',
    value: '142.5K',
    change: 12.4,
    sparkline: [30, 45, 38, 52, 60, 55, 72],
  },
  {
    label: 'Profile Visits',
    value: '3,240',
    change: 8.1,
    sparkline: [20, 28, 25, 35, 32, 40, 38],
  },
  {
    label: 'Engagement',
    value: '6.8%',
    change: -1.2,
    sparkline: [7.2, 7.0, 6.5, 6.8, 6.6, 7.1, 6.8],
  },
  {
    label: 'Avg. Watch',
    value: '18.4s',
    change: 5.6,
    sparkline: [14, 15, 16, 17, 16, 18, 18.4],
  },
];

/* ── earnings ─────────────────────────────────────────────────────────── */
export const EARNINGS = {
  thisMonth: 1100,
  monthlyGoal: 2000,
  lastMonth: 850,
  totalAllTime: 4200,
  pending: 200,
};

/* ── settings ─────────────────────────────────────────────────────────── */
export const SETTINGS: SettingItem[] = [
  { id: 's1', icon: '👤', label: 'Edit Profile',       type: 'navigation' },
  { id: 's2', icon: '🔔', label: 'Notifications',      type: 'toggle', value: true },
  { id: 's3', icon: '🔒', label: 'Privacy',            type: 'navigation' },
  { id: 's4', icon: '💳', label: 'Payment Methods',    type: 'navigation', badgeText: '2' },
  { id: 's5', icon: '📊', label: 'Analytics',          type: 'navigation' },
  { id: 's6', icon: '🌙', label: 'Dark Mode',          type: 'toggle', value: false },
  { id: 's7', icon: '❓', label: 'Help & Support',     type: 'navigation' },
  { id: 's8', icon: '🚪', label: 'Sign Out',           type: 'navigation', danger: true },
];

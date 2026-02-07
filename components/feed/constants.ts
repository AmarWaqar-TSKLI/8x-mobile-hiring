/**
 * Feed — shared constants, types & mock campaign data
 */
import { Dimensions } from 'react-native';

export const { width: SW } = Dimensions.get('window');

/* ── colour tokens ────────────────────────────────────────────────────── */
export const C = {
  bg:       '#FAFAFA',
  surface:  '#FFFFFF',
  ink:      '#0A2540',
  inkSoft:  '#425466',
  muted:    '#6B7C93',
  subtle:   '#C1C9D2',
  border:   '#E6EBF1',
  accent:   '#635BFF',
  accentBg: '#F0EEFF',
  accentAlt:'#00D4AA',
  orange:   '#FF7A00',
  pink:     '#FF3CAC',
  greenBg:  '#E8FBF5',
  greenText:'#00B386',
  danger:   '#FF4757',
  shimmer1: '#F0F0F0',
  shimmer2: '#E0E0E0',
};

/* ── types ────────────────────────────────────────────────────────────── */
export interface Brand {
  name: string;
  initial: string;
  color: string;
  verified: boolean;
}

export type CampaignStatus = 'open' | 'applied' | 'in-progress' | 'completed';

export interface Campaign {
  id: string;
  brand: Brand;
  title: string;
  description: string;
  pay: number;
  category: string;
  deadline: string;          // ISO date
  image: string;             // remote URL
  applicants: number;
  slots: number;
  status: CampaignStatus;
  featured: boolean;
}

/* ── filter pills ─────────────────────────────────────────────────────── */
export const FILTERS = ['For You', 'Trending', 'New', 'High Pay', 'Lifestyle', 'Beauty', 'Tech'] as const;

/* ── mock data ────────────────────────────────────────────────────────── */
export const CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    brand: { name: 'Nike', initial: 'N', color: '#111111', verified: true },
    title: 'Summer Fitness Challenge',
    description:
      'Create a 30-second reel showcasing your workout routine with Nike gear. High-energy, authentic content preferred.',
    pay: 450,
    category: 'Fitness',
    deadline: '2026-02-20',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    applicants: 47,
    slots: 120,
    status: 'open',
    featured: true,
  },
  {
    id: '2',
    brand: { name: 'Glossier', initial: 'G', color: '#F5C6D0', verified: true },
    title: 'Dewy Skin Morning Routine',
    description:
      'Share your morning skincare routine featuring Glossier products. Natural lighting, authentic vibes only.',
    pay: 300,
    category: 'Beauty',
    deadline: '2026-02-28',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    applicants: 82,
    slots: 200,
    status: 'open',
    featured: false,
  },
  {
    id: '3',
    brand: { name: 'Samsung', initial: 'S', color: '#1428A0', verified: true },
    title: 'Galaxy S26 Unboxing',
    description:
      'Unbox and review the new Galaxy S26. Show off camera quality, design, and your first impressions.',
    pay: 500,
    category: 'Tech',
    deadline: '2026-03-05',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
    applicants: 34,
    slots: 60,
    status: 'open',
    featured: false,
  },
  {
    id: '4',
    brand: { name: 'Blue Apron', initial: 'B', color: '#0052CC', verified: false },
    title: 'Cook With Me Series',
    description:
      'Film a cozy "cook with me" video using a Blue Apron meal kit. Show the unboxing, prep, and finished dish.',
    pay: 250,
    category: 'Food',
    deadline: '2026-03-10',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    applicants: 19,
    slots: 40,
    status: 'applied',
    featured: false,
  },
  {
    id: '5',
    brand: { name: 'Zara', initial: 'Z', color: '#1A1A1A', verified: true },
    title: 'Spring Streetwear Lookbook',
    description:
      'Style 3 outfits using Zara\'s new spring collection. Urban setting, cinematic transitions encouraged.',
    pay: 400,
    category: 'Fashion',
    deadline: '2026-03-15',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    applicants: 63,
    slots: 120,
    status: 'open',
    featured: false,
  },
  {
    id: '6',
    brand: { name: 'Headspace', initial: 'H', color: '#F47D31', verified: true },
    title: 'Mindful Morning Vlog',
    description:
      'Document your mindful morning routine — meditation, journaling, movement. Calm aesthetic, soft palette.',
    pay: 200,
    category: 'Wellness',
    deadline: '2026-02-25',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    applicants: 28,
    slots: 50,
    status: 'in-progress',
    featured: false,
  },
  {
    id: '7',
    brand: { name: 'Spotify', initial: 'S', color: '#1DB954', verified: true },
    title: 'Playlist Reaction Video',
    description:
      'React to Spotify\'s curated "Discover Weekly" playlist live on camera. Genuine reactions, good energy.',
    pay: 175,
    category: 'Music',
    deadline: '2026-03-01',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    applicants: 55,
    slots: 80,
    status: 'open',
    featured: false,
  },
  {
    id: '8',
    brand: { name: 'Airbnb', initial: 'A', color: '#FF5A5F', verified: true },
    title: 'Hidden Gems Travel Reel',
    description:
      'Showcase a hidden gem destination you\'ve visited. Drone shots, local eats, and insider tips welcome.',
    pay: 350,
    category: 'Travel',
    deadline: '2026-03-20',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
    applicants: 91,
    slots: 150,
    status: 'completed',
    featured: false,
  },
];

/* ── helpers ──────────────────────────────────────────────────────────── */
export function daysUntil(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export function statusMeta(status: CampaignStatus) {
  switch (status) {
    case 'open':        return { label: 'Apply Now',    bg: C.accent,   text: '#FFF' };
    case 'applied':     return { label: 'Applied',      bg: C.accentBg, text: C.accent };
    case 'in-progress': return { label: 'In Progress',  bg: '#FFF3E0',  text: C.orange };
    case 'completed':   return { label: 'Completed',    bg: C.greenBg,  text: C.greenText };
  }
}

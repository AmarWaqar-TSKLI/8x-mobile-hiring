/**
 * Upload — shared constants, types & mock video data
 */
import { Dimensions } from 'react-native';

export const { width: SW, height: SH } = Dimensions.get('window');

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
  overlay:  'rgba(10, 37, 64, 0.55)',
};

/* ── types ────────────────────────────────────────────────────────────── */
export type VideoStatus = 'published' | 'processing' | 'draft' | 'review';

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;        // remote URL
  duration: string;         // "0:32"
  views: number;
  likes: number;
  status: VideoStatus;
  campaign?: string;        // linked campaign name
  uploadedAt: string;       // ISO
  earnings?: number;
}

export interface DraftItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  lastEdited: string;       // ISO
  progress: number;         // 0-1
}

/* ── helpers ──────────────────────────────────────────────────────────── */
export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}

export function statusMeta(status: VideoStatus) {
  switch (status) {
    case 'published':  return { label: 'Published',  dot: C.accentAlt, bg: C.greenBg,  text: C.greenText };
    case 'processing': return { label: 'Processing', dot: C.orange,    bg: '#FFF3E0',  text: C.orange    };
    case 'draft':      return { label: 'Draft',      dot: C.subtle,    bg: '#F1F5F9',  text: C.muted     };
    case 'review':     return { label: 'In Review',  dot: C.accent,    bg: C.accentBg, text: C.accent    };
  }
}

/* ── mock published videos ────────────────────────────────────────────── */
export const VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: 'Morning Workout Routine 🏋️',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    duration: '0:32',
    views: 12400,
    likes: 843,
    status: 'published',
    campaign: 'Nike',
    uploadedAt: '2026-02-05T10:00:00Z',
    earnings: 150,
  },
  {
    id: 'v2',
    title: 'Skincare Night Ritual ✨',
    thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
    duration: '0:45',
    views: 8700,
    likes: 621,
    status: 'published',
    campaign: 'Glossier',
    uploadedAt: '2026-02-03T14:30:00Z',
    earnings: 200,
  },
  {
    id: 'v3',
    title: 'Tech Desk Setup Tour',
    thumbnail: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80',
    duration: '1:12',
    views: 5300,
    likes: 389,
    status: 'review',
    campaign: 'Samsung',
    uploadedAt: '2026-02-04T09:15:00Z',
  },
  {
    id: 'v4',
    title: 'Street Style Lookbook SS26',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    duration: '0:58',
    views: 15200,
    likes: 1100,
    status: 'published',
    campaign: 'Zara',
    uploadedAt: '2026-01-28T16:00:00Z',
    earnings: 400,
  },
  {
    id: 'v5',
    title: 'Cooking ASMR — Pasta Night',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    duration: '2:05',
    views: 3100,
    likes: 245,
    status: 'processing',
    uploadedAt: '2026-02-06T08:00:00Z',
  },
  {
    id: 'v6',
    title: 'Hidden Beach — Travel Vlog',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    duration: '1:35',
    views: 22100,
    likes: 1870,
    status: 'published',
    campaign: 'Airbnb',
    uploadedAt: '2026-01-20T12:00:00Z',
    earnings: 350,
  },
];

/* ── mock drafts ──────────────────────────────────────────────────────── */
export const DRAFTS: DraftItem[] = [
  {
    id: 'd1',
    title: 'Unboxing Galaxy S26',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    duration: '0:00',
    lastEdited: '2026-02-06T07:00:00Z',
    progress: 0.3,
  },
  {
    id: 'd2',
    title: 'Mindful Morning Routine',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    duration: '0:22',
    lastEdited: '2026-02-05T18:00:00Z',
    progress: 0.7,
  },
];

/* ── upload stats ─────────────────────────────────────────────────────── */
export const UPLOAD_STATS = {
  totalVideos: VIDEOS.length,
  totalViews: VIDEOS.reduce((sum, v) => sum + v.views, 0),
  totalEarnings: VIDEOS.reduce((sum, v) => sum + (v.earnings ?? 0), 0),
  avgEngagement: 6.8,
};

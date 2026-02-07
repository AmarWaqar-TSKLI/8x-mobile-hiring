import { Dimensions } from 'react-native';

export const { width: SW, height: SH } = Dimensions.get('window');

/** Shared color palette — Stripe-inspired */
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
  accentBg2: '#E8FBF5',
  orange:    '#FF7A00',
  pink:      '#FF3CAC',
  peach:     '#FF9A76',
  violet:    '#C56CF0',
  lavender:  '#D4A0FF',
};

export const STATS = [
  { end: 12, suffix: 'K+', label: 'Creators' },
  { end: 48, suffix: 'M+', label: 'Earned' },
  { end: 200, suffix: '+', label: 'Brands' },
];

export const FEATURES = [
  { icon: '◆', color: C.accent, bg: C.accentBg, title: 'UGC Campaigns', body: 'Browse live briefs from top brands and apply in seconds — no follower count required.' },
  { icon: '◈', color: C.accentAlt, bg: C.accentBg2, title: 'Transparent Payouts', body: 'Know your rate upfront. Get paid on time, every time, directly to your bank account.' },
  { icon: '▣', color: C.accent, bg: C.accentBg, title: 'Performance Insights', body: 'Track views, engagement, and earnings in one clean dashboard built for creators.' },
  { icon: '⬡', color: C.accentAlt, bg: C.accentBg2, title: 'Smart Matching', body: 'Our AI pairs you with the perfect brand collaborations based on your style and niche.' },
];

export const STEPS = [
  { num: '01', title: 'Create your profile', body: 'Showcase your best content and set your rates in under two minutes.' },
  { num: '02', title: 'Get matched', body: 'Brands find you — or browse open briefs and pitch directly.' },
  { num: '03', title: 'Submit your content', body: 'Follow the brief, shoot your content, and upload it for review.' },
  { num: '04', title: 'Get approved', body: 'Brands review and approve your work — most feedback within 24 hours.' },
  { num: '05', title: 'Get paid instantly', body: 'Receive your payout directly to your bank — no invoicing, no delays.' },
];

export const TESTIMONIALS = [
  { name: 'Sarah Mitchell', role: 'Lifestyle Creator', text: '8x completely changed how I work with brands. The payouts are fast and the briefs are always high quality. Best platform I\'ve used.' },
  { name: 'James Chen', role: 'Tech Reviewer', text: 'I finally deleted my spreadsheet of brand contacts. 8x handles everything — matching, contracts, payments. It just works.' },
  { name: 'Priya Sharma', role: 'Food & Travel', text: 'The quality of brands on 8x is unmatched. I\'ve tripled my monthly income since joining six months ago.' },
  { name: 'Marcus Johnson', role: 'Fitness Creator', text: 'As a micro-creator, I never thought brands would find me. 8x\'s matching algorithm connected me with my dream collaborations.' },
  { name: 'Elena Rodriguez', role: 'Beauty & Skincare', text: 'Transparent rates, no haggling, instant payouts. 8x treats creators like real partners, not an afterthought.' },
  { name: 'David Kim', role: 'Photography', text: '8x is one of those apps I never close. The dashboard alone saves me hours every week tracking campaigns and earnings.' },
];

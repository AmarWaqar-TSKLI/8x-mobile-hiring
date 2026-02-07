import { Dimensions } from 'react-native';

export const { width: SW, height: SH } = Dimensions.get('window');

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
  danger:   '#FF4757',
};

export const TOTAL_STEPS = 5; // 0-4

export const NICHES = [
  { label: 'Lifestyle',       icon: '✦' },
  { label: 'Beauty',          icon: '◆' },
  { label: 'Fitness',         icon: '▲' },
  { label: 'Tech',            icon: '◈' },
  { label: 'Food & Travel',   icon: '◉' },
  { label: 'Fashion',         icon: '❖' },
  { label: 'Gaming',          icon: '◇' },
  { label: 'Photography',     icon: '◎' },
  { label: 'Music',           icon: '♫' },
  { label: 'Education',       icon: '▣' },
  { label: 'Comedy',          icon: '☆' },
  { label: 'Health & Wellness', icon: '⬡' },
];

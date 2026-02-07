/**
 * StatsBar — horizontal scrollable stat cards for upload overview
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C, UPLOAD_STATS, formatViews } from './constants';

interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
}

const STAT_ITEMS: StatItem[] = [
  {
    label: 'Total Videos',
    value: String(UPLOAD_STATS.totalVideos),
    icon: '▶',
    color: C.accent,
    bgColor: C.accentBg,
  },
  {
    label: 'Total Views',
    value: formatViews(UPLOAD_STATS.totalViews),
    icon: '◉',
    color: C.accentAlt,
    bgColor: C.greenBg,
  },
  {
    label: 'Earnings',
    value: `$${UPLOAD_STATS.totalEarnings.toLocaleString()}`,
    icon: '◈',
    color: C.orange,
    bgColor: '#FFF3E0',
  },
  {
    label: 'Engagement',
    value: `${UPLOAD_STATS.avgEngagement}%`,
    icon: '♥',
    color: C.pink,
    bgColor: '#FFF0F6',
  },
];

export function StatsBar() {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1, duration: 600, delay: 100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: entrance,
        transform: [{
          translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
        }],
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {STAT_ITEMS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

/* ── Individual stat card ─────────────────────────────────────────────── */
function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1, duration: 500, delay: 200 + index * 80,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        s.card,
        {
          opacity: entrance,
          transform: [{
            scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }),
          }],
        },
      ]}
    >
      <View style={[s.iconCircle, { backgroundColor: stat.bgColor }]}>
        <Text style={[s.icon, { color: stat.color }]}>{stat.icon}</Text>
      </View>
      <Text style={s.value}>{stat.value}</Text>
      <Text style={s.label}>{stat.label}</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 10,
  },

  card: {
    width: 120,
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'flex-start',
    gap: 8,
  },
  iconCircle: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  icon: {
    fontSize: 16, fontWeight: '800',
  },
  value: {
    fontSize: 22, fontWeight: '800', color: C.ink,
    letterSpacing: -0.8,
  },
  label: {
    fontSize: 11, fontWeight: '600', color: C.muted,
    letterSpacing: 0.1,
  },
});

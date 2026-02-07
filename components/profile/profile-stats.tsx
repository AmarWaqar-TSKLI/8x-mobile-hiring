/**
 * ProfileStats — analytics snapshot cards with mini sparklines
 *
 * Features:
 * - Horizontal scrollable stat cards
 * - Each card has label, value, change %, and a mini graph
 * - Sparkline drawn with absolutely-positioned View bars
 * - Staggered entrance animation per card
 * - Green/red change indicator
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C, ANALYTICS } from './constants';
import type { AnalyticsSnapshot } from './constants';

export function ProfileStats() {
  return (
    <View style={s.root}>
      <Text style={s.heading}>Analytics Overview</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {ANALYTICS.map((item, i) => (
          <StatCard key={item.label} item={item} index={i} />
        ))}
      </ScrollView>
    </View>
  );
}

/* ── individual card ──────────────────────────────────────────────────── */
function StatCard({ item, index }: { item: AnalyticsSnapshot; index: number }) {
  const y = useRef(new Animated.Value(20)).current;
  const o = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 70;
    Animated.parallel([
      Animated.timing(y, { toValue: 0, duration: 450, delay, useNativeDriver: true }),
      Animated.timing(o, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const isPositive = item.change >= 0;
  const max = Math.max(...item.sparkline);
  const min = Math.min(...item.sparkline);
  const range = max - min || 1;

  return (
    <Animated.View style={[s.card, { opacity: o, transform: [{ translateY: y }] }]}>
      {/* top row */}
      <Text style={s.cardLabel}>{item.label}</Text>
      <Text style={s.cardValue}>{item.value}</Text>

      {/* change badge */}
      <View style={[s.changeBadge, isPositive ? s.changeUp : s.changeDown]}>
        <Text style={[s.changeText, isPositive ? s.changeTextUp : s.changeTextDown]}>
          {isPositive ? '↑' : '↓'} {Math.abs(item.change)}%
        </Text>
      </View>

      {/* sparkline */}
      <View style={s.sparkWrap}>
        {item.sparkline.map((v, si) => {
          const height = 4 + ((v - min) / range) * 22;
          return (
            <View
              key={si}
              style={[
                s.sparkBar,
                {
                  height,
                  backgroundColor: isPositive ? C.accentAlt : C.danger,
                  opacity: 0.3 + (si / item.sparkline.length) * 0.7,
                },
              ]}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { marginTop: 24 },
  heading: {
    fontSize: 17,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.4,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 150,
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    gap: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.muted,
    letterSpacing: 0.1,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.5,
  },
  changeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changeUp:   { backgroundColor: C.greenBg },
  changeDown: { backgroundColor: '#FFF0F0' },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  changeTextUp:   { color: C.greenText },
  changeTextDown: { color: C.danger },

  /* sparkline */
  sparkWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginTop: 6,
    height: 28,
  },
  sparkBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 4,
  },
});

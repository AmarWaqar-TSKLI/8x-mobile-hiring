/**
 * AchievementRow — premium minimal milestone badges
 *
 * Clean card-based design matching the app's Stripe-inspired style.
 * Subtle accent tints, no heavy tier colours — uses the shared palette.
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C, ACHIEVEMENTS } from './constants';
import type { Achievement } from './constants';

export function AchievementRow() {
  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.heading}>Achievements</Text>
        <View style={s.countPill}>
          <Text style={s.countText}>{unlocked}/{ACHIEVEMENTS.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {ACHIEVEMENTS.map((a, i) => (
          <Badge key={a.id} badge={a} index={i} />
        ))}
      </ScrollView>
    </View>
  );
}

/* ── individual badge card ────────────────────────────────────────────── */
function Badge({ badge, index }: { badge: Achievement; index: number }) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const o     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 80;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 70,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(o, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const pct = Math.round(badge.progress * 100);

  return (
    <Animated.View
      style={[
        s.card,
        {
          opacity: o,
          transform: [{ scale }],
        },
      ]}
    >
      {/* Icon */}
      <View style={[s.iconCircle, badge.unlocked && s.iconCircleUnlocked]}>
        <Text style={s.icon}>{badge.icon}</Text>
      </View>

      {/* Title */}
      <Text style={[s.title, !badge.unlocked && s.titleLocked]} numberOfLines={1}>
        {badge.title}
      </Text>

      {/* Progress bar */}
      <View style={s.progressTrack}>
        <View
          style={[
            s.progressFill,
            { width: `${pct}%` as any },
            badge.unlocked && s.progressFillDone,
          ]}
        />
      </View>

      {/* Status */}
      <Text style={[s.status, badge.unlocked && s.statusUnlocked]}>
        {badge.unlocked ? '✓ Unlocked' : `${pct}%`}
      </Text>
    </Animated.View>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { marginTop: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  heading: {
    fontSize: 17,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.4,
  },
  countPill: {
    backgroundColor: C.accentBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.accent,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 10,
  },

  card: {
    width: 120,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.04)' }
      : { elevation: 1 }),
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.bg,
  },
  iconCircleUnlocked: {
    backgroundColor: C.accentBg,
  },
  icon: { fontSize: 18 },

  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
    color: C.ink,
  },
  titleLocked: {
    color: C.muted,
  },

  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: C.subtle,
  },
  progressFillDone: {
    backgroundColor: C.accent,
  },

  status: {
    fontSize: 11,
    fontWeight: '600',
    color: C.muted,
  },
  statusUnlocked: {
    color: C.accent,
  },
});

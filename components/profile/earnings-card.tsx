/**
 * EarningsCard — monthly earnings dashboard card
 *
 * Features:
 * - Monthly progress bar toward earning goal
 * - This month vs last month comparison
 * - Pending payout callout
 * - All-time total
 * - Animated progress bar fill on mount
 * - Clean card layout with gradient-feel accent strip
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C, EARNINGS } from './constants';

export function EarningsCard() {
  const progressW = useRef(new Animated.Value(0)).current;
  const cardO     = useRef(new Animated.Value(0)).current;
  const cardY     = useRef(new Animated.Value(18)).current;

  const pct = Math.min(EARNINGS.thisMonth / EARNINGS.monthlyGoal, 1);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardO, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(cardY, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();

    // animate the progress bar width (non-native since it's layout)
    Animated.timing(progressW, {
      toValue: pct,
      duration: 900,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const growth = EARNINGS.lastMonth > 0
    ? Math.round(((EARNINGS.thisMonth - EARNINGS.lastMonth) / EARNINGS.lastMonth) * 100)
    : 0;

  return (
    <Animated.View
      style={[s.card, { opacity: cardO, transform: [{ translateY: cardY }] }]}
    >
      {/* accent strip */}
      <View style={s.accentStrip} />

      {/* header row */}
      <View style={s.headerRow}>
        <Text style={s.heading}>Earnings</Text>
        <View style={s.growthBadge}>
          <Text style={s.growthText}>
            {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}% vs last mo.
          </Text>
        </View>
      </View>

      {/* big number */}
      <Text style={s.bigAmount}>${EARNINGS.thisMonth.toLocaleString()}</Text>
      <Text style={s.goalLabel}>
        of ${EARNINGS.monthlyGoal.toLocaleString()} monthly goal
      </Text>

      {/* progress bar */}
      <View style={s.progressTrack}>
        <Animated.View
          style={[
            s.progressFill,
            {
              width: progressW.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* bottom row */}
      <View style={s.bottomRow}>
        <MetricPill label="All-Time" value={`$${EARNINGS.totalAllTime.toLocaleString()}`} />
        <MetricPill label="Pending" value={`$${EARNINGS.pending.toLocaleString()}`} accent />
        <MetricPill label="Last Month" value={`$${EARNINGS.lastMonth.toLocaleString()}`} />
      </View>
    </Animated.View>
  );
}

/* ── small metric pill ────────────────────────────────────────────────── */
function MetricPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={[s.pill, accent && s.pillAccent]}>
      <Text style={s.pillLabel}>{label}</Text>
      <Text style={[s.pillValue, accent && s.pillValueAccent]}>{value}</Text>
    </View>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  accentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: C.accent,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heading: {
    fontSize: 17,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.4,
  },
  growthBadge: {
    backgroundColor: C.greenBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  growthText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.greenText,
  },

  bigAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -1,
    marginTop: 4,
  },
  goalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.muted,
    marginTop: 2,
    marginBottom: 14,
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: C.shimmer1,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: C.accent,
  },

  bottomRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  pill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 3,
  },
  pillAccent: {
    backgroundColor: C.accentBg,
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  pillValue: {
    fontSize: 14,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.3,
  },
  pillValueAccent: {
    color: C.accent,
  },
});

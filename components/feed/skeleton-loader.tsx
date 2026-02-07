/**
 * Skeleton loader — animated shimmer placeholders for feed loading state
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import { C } from './constants';

/* ── Shimmer block ────────────────────────────────────────────────────── */
function Shimmer({ width, height, radius = 8, style }: {
  width: number | string;
  height: number;
  radius?: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: C.shimmer2,
          opacity,
        },
        style,
      ]}
    />
  );
}

/* ── Skeleton Card ────────────────────────────────────────────────────── */
export function SkeletonCard({ delay = 0 }: { delay?: number }) {
  const { width: screenW } = useWindowDimensions();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 500,
      delay,
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
            translateY: entrance.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }],
        },
      ]}
    >
      {/* Brand row */}
      <View style={s.brandRow}>
        <Shimmer width={40} height={40} radius={20} />
        <View style={s.brandInfo}>
          <Shimmer width={120} height={14} />
          <Shimmer width={70} height={11} style={{ marginTop: 6 }} />
        </View>
        <Shimmer width={64} height={28} radius={14} />
      </View>

      {/* Image placeholder */}
      <Shimmer
        width={'100%' as any}
        height={(screenW - 56 - 32) * 0.5}
        radius={14}
        style={{ marginTop: 16 }}
      />

      {/* Title + description */}
      <Shimmer width={'85%' as any} height={18} style={{ marginTop: 18 }} />
      <Shimmer width={'100%' as any} height={13} style={{ marginTop: 10 }} />
      <Shimmer width={'70%' as any} height={13} style={{ marginTop: 6 }} />

      {/* Meta row */}
      <View style={s.metaRow}>
        <Shimmer width={90} height={12} />
        <Shimmer width={80} height={12} />
      </View>

      {/* CTA */}
      <Shimmer
        width={'100%' as any}
        height={50}
        radius={14}
        style={{ marginTop: 18 }}
      />
    </Animated.View>
  );
}

/* ── Full skeleton list ───────────────────────────────────────────────── */
export function SkeletonList() {
  return (
    <View style={s.list}>
      <SkeletonCard delay={0} />
      <SkeletonCard delay={120} />
      <SkeletonCard delay={240} />
    </View>
  );
}

const s = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingTop: 12, gap: 20 },
  card: {
    backgroundColor: C.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandInfo: { flex: 1 },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
  },
});

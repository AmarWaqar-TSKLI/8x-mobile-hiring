/**
 * Step 4 — All Set / Success
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { C } from './constants';
import { useEntrance, usePulse } from './hooks';

interface Props {
  name: string;
  onFinish: () => void;
}

export function StepSuccess({ name, onFinish }: Props) {
  const { width: screenW } = useWindowDimensions();
  const h   = useEntrance(300);
  const f   = useEntrance(600);
  const pulse = usePulse(0.97, 1.03, 2000);

  // Big checkmark entrance
  const checkScale   = useRef(new Animated.Value(0)).current;
  const checkRotate  = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(checkScale, { toValue: 1, friction: 5, tension: 60, delay: 100, useNativeDriver: true }),
      Animated.timing(checkRotate, { toValue: 1, duration: 800, delay: 100, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const rotate = checkRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg'],
  });

  // Confetti-like dots
  const dots = [
    { color: C.accent,    x: -80, y: -60,  delay: 200, size: 10 },
    { color: C.accentAlt, x: 70,  y: -50,  delay: 300, size: 12 },
    { color: C.orange,    x: -60, y: 50,   delay: 400, size: 8 },
    { color: C.pink,      x: 90,  y: 30,   delay: 350, size: 11 },
    { color: '#635BFF',   x: -30, y: -80,  delay: 250, size: 9 },
    { color: '#00D4AA',   x: 50,  y: 70,   delay: 450, size: 10 },
    { color: C.orange,    x: -90, y: 10,   delay: 500, size: 7 },
    { color: C.pink,      x: 30,  y: -90,  delay: 280, size: 8 },
  ];

  return (
    <View style={s.container}>
      {/* Celebration area */}
      <View style={s.celebArea}>
        {dots.map((d, i) => (
          <ConfettiDot key={i} {...d} screenW={screenW} />
        ))}

        <Animated.View style={[s.checkCircle, { transform: [{ scale: checkScale }, { rotate }, { scale: pulse }] }]}>
          <Text style={s.checkMark}>✓</Text>
        </Animated.View>
      </View>

      <Animated.View style={{ opacity: h.opacity, transform: [{ translateY: h.translateY }] }}>
        <Text style={s.title}>You're all set{name ? `, ${name.split(' ')[0]}` : ''}!</Text>
        <Text style={[s.subtitle, { maxWidth: screenW * 0.85 }]}>
          Your creator profile is ready. Start browsing campaigns and earn your first payout today.
        </Text>
      </Animated.View>

      {/* Stats preview */}
      <Animated.View style={[s.previewCard, { opacity: f.opacity, transform: [{ translateY: f.translateY }] }]}>
        <View style={s.previewRow}>
          <View style={s.previewStat}>
            <Text style={s.previewNum}>0</Text>
            <Text style={s.previewLabel}>Campaigns</Text>
          </View>
          <View style={s.previewDivider} />
          <View style={s.previewStat}>
            <Text style={s.previewNum}>$0</Text>
            <Text style={s.previewLabel}>Earned</Text>
          </View>
          <View style={s.previewDivider} />
          <View style={s.previewStat}>
            <Text style={s.previewNum}>∞</Text>
            <Text style={s.previewLabel}>Potential</Text>
          </View>
        </View>
      </Animated.View>

      {/* CTA */}
      <View style={s.bottomArea}>
        <Pressable onPress={onFinish}>
          <View style={s.btn}>
            <Text style={s.btnText}>Start Exploring</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

/* ── individual confetti dot ──────────────────────────────────────────────── */

function ConfettiDot({ color, x, y, delay, size, screenW }: {
  color: string; x: number; y: number; delay: number; size: number; screenW: number;
}) {
  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const ty      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 60, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
    ]).start();

    // Gentle float
    Animated.loop(
      Animated.sequence([
        Animated.timing(ty, { toValue: -8, duration: 1500 + delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(ty, { toValue: 8, duration: 1500 + delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: screenW / 2 + x - size / 2,
        top: 80 + y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ scale }, { translateY: ty }],
      }}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 16 },

  celebArea: {
    height: 200, alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },

  checkCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: C.accentAlt, alignItems: 'center', justifyContent: 'center',
    boxShadow: '0px 12px 24px rgba(0, 212, 170, 0.3)',
    elevation: 8,
  },
  checkMark: { fontSize: 44, fontWeight: '800', color: '#FFF', marginTop: -2 },

  title: {
    fontSize: 30, fontWeight: '800', color: C.ink,
    letterSpacing: -1.5, textAlign: 'center', marginBottom: 12,
  },
  subtitle: {
    fontSize: 16, lineHeight: 24, color: C.muted,
    textAlign: 'center', marginBottom: 32,
    alignSelf: 'center',
  },

  previewCard: {
    backgroundColor: C.surface, borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: C.border,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.04)',
    elevation: 2,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center' },
  previewStat: { flex: 1, alignItems: 'center' },
  previewNum: { fontSize: 28, fontWeight: '800', color: C.ink, letterSpacing: -1 },
  previewLabel: { fontSize: 12, fontWeight: '600', color: C.muted, marginTop: 4 },
  previewDivider: { width: 1, height: 36, backgroundColor: C.border },

  bottomArea: { marginTop: 'auto', paddingBottom: 16, alignItems: 'center' },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.accent, paddingVertical: 18, paddingHorizontal: 48,
    borderRadius: 14,
    boxShadow: '0px 8px 16px rgba(99, 91, 255, 0.25)',
    elevation: 4,
  },
  btnText: { fontSize: 17, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },
});

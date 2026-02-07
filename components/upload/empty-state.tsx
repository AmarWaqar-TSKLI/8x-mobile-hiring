/**
 * EmptyUpload — beautiful empty state when no videos exist
 * Includes animated illustration and prominent CTA
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

interface Props {
  onUpload: () => void;
}

export function EmptyUpload({ onUpload }: Props) {
  const { width: screenW } = useWindowDimensions();
  /* entrance */
  const opacity = useRef(new Animated.Value(0)).current;
  const ty      = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 700,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.spring(ty, {
        toValue: 0, friction: 10, tension: 45, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* floating animation on the illustration */
  const floatY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -8, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 8, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  /* CTA scale */
  const btnScale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[s.container, { opacity, transform: [{ translateY: ty }] }]}>
      {/* Illustration circle */}
      <Animated.View style={[s.illustration, { transform: [{ translateY: floatY }] }]}>
        <View style={s.outerRing}>
          <View style={s.innerRing}>
            <View style={s.cameraBody}>
              <View style={s.cameraLens} />
              <View style={s.cameraFlash} />
            </View>
          </View>
        </View>
        {/* Decorative dots */}
        <View style={[s.decoDot, { top: 8, right: 15, backgroundColor: C.accent, width: 10, height: 10 }]} />
        <View style={[s.decoDot, { bottom: 15, left: 10, backgroundColor: C.accentAlt, width: 7, height: 7 }]} />
        <View style={[s.decoDot, { top: 25, left: 5, backgroundColor: C.orange, width: 6, height: 6 }]} />
        <View style={[s.decoDot, { bottom: 5, right: 25, backgroundColor: C.pink, width: 8, height: 8 }]} />
      </Animated.View>

      <Text style={s.title}>Upload your first video</Text>
      <Text style={[s.subtitle, { maxWidth: screenW * 0.78 }]}>
        Share your content with brands and start earning. Record something fresh or pick from your gallery.
      </Text>

      {/* Features row */}
      <View style={s.features}>
        <FeatureChip icon="⚡" label="60s max" />
        <FeatureChip icon="✦" label="HD quality" />
        <FeatureChip icon="◈" label="Brand tag" />
      </View>

      {/* CTA */}
      <Pressable
        onPressIn={() => Animated.spring(btnScale, { toValue: 0.94, friction: 8, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
        onPress={onUpload}
      >
        <Animated.View style={[s.btn, { transform: [{ scale: btnScale }] }]}>
          <View style={s.btnPlus}>
            <View style={s.plusH} />
            <View style={s.plusV} />
          </View>
          <Text style={s.btnText}>Upload Video</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/* ── Small feature chip ───────────────────────────────────────────────── */
function FeatureChip({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={fc.chip}>
      <Text style={fc.icon}>{icon}</Text>
      <Text style={fc.label}>{label}</Text>
    </View>
  );
}
const fc = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.surface,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1, borderColor: C.border,
  },
  icon: { fontSize: 12 },
  label: { fontSize: 11, fontWeight: '600', color: C.inkSoft },
});

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 36,
    paddingBottom: 80,
  },

  illustration: {
    width: 140, height: 140,
    marginBottom: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  outerRing: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: C.accentBg,
    alignItems: 'center', justifyContent: 'center',
  },
  innerRing: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: C.accent + '22',
    alignItems: 'center', justifyContent: 'center',
  },
  cameraBody: {
    width: 44, height: 32, borderRadius: 10,
    backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  cameraLens: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#FFF',
  },
  cameraFlash: {
    position: 'absolute', top: -4, right: 6,
    width: 8, height: 5, borderRadius: 2,
    backgroundColor: C.accent,
  },
  decoDot: {
    position: 'absolute', borderRadius: 50,
  },

  title: {
    fontSize: 24, fontWeight: '800', color: C.ink,
    letterSpacing: -0.8, textAlign: 'center', marginBottom: 10,
  },
  subtitle: {
    fontSize: 15, lineHeight: 22, color: C.muted,
    textAlign: 'center', marginBottom: 24,
  },

  features: {
    flexDirection: 'row', gap: 10,
    marginBottom: 28,
  },

  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.accent,
    paddingVertical: 18, paddingHorizontal: 36,
    borderRadius: 16,
    boxShadow: '0px 8px 20px rgba(99, 91, 255, 0.3)',
    elevation: 6,
  },
  btnPlus: {
    width: 20, height: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  plusH: {
    width: 14, height: 2.5, borderRadius: 1.25,
    backgroundColor: '#FFF',
    position: 'absolute',
  },
  plusV: {
    width: 2.5, height: 14, borderRadius: 1.25,
    backgroundColor: '#FFF',
    position: 'absolute',
  },
  btnText: {
    fontSize: 17, fontWeight: '700', color: '#FFF',
    letterSpacing: -0.3,
  },
});

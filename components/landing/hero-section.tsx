/**
 * HeroSection — Full-viewport dark hero with interactive particle background
 *
 * - Covers 100% of device screen height
 * - Antigravity particle field as background (Three.js / R3F)
 * - Large heading with spring-animated rotating word
 * - Centered content with generous text width
 * - Two CTA buttons (outline + filled)
 * - Smooth stagger entrance
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Antigravity } from './antigravity';

/* ── Color tokens for dark hero ──────────────────────────────────────── */
const D = {
  bg: '#000000',
  ink: '#FFFFFF',
  muted: 'rgba(255,255,255,0.55)',
  subtle: 'rgba(255,255,255,0.35)',
  border: 'rgba(255,255,255,0.15)',
};

/* ── Rotating words — each completes "The creator platform to ___" ──── */
const WORDS = ['get brand deals.', 'get paid faster.', 'scale content.'];
const WORD_INTERVAL = 2200;

/* ── RotatingWord ────────────────────────────────────────────────────── */
function RotatingWord() {
  const [index, setIndex] = useState(0);
  const words = useMemo(() => WORDS, []);

  const anims = useRef(
    words.map((_, i) => ({
      opacity: new Animated.Value(i === 0 ? 1 : 0),
      translateY: new Animated.Value(i === 0 ? 0 : 40),
    })),
  ).current;

  useEffect(() => {
    const id = setTimeout(() => {
      const current = index;
      const next = (index + 1) % words.length;

      Animated.parallel([
        Animated.timing(anims[current].opacity, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(anims[current].translateY, { toValue: -50, duration: 350, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      ]).start();

      anims[next].translateY.setValue(50);
      anims[next].opacity.setValue(0);

      setTimeout(() => {
        Animated.parallel([
          Animated.spring(anims[next].translateY, { toValue: 0, friction: 10, tension: 50, useNativeDriver: true }),
          Animated.timing(anims[next].opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
      }, 100);

      setIndex(next);
    }, WORD_INTERVAL);

    return () => clearTimeout(id);
  }, [index, words, anims]);

  return (
    <View style={hs.rotatingWrap}>
      {words.map((word, i) => (
        <Animated.Text
          key={word}
          style={[
            hs.rotatingWord,
            {
              opacity: anims[i].opacity,
              transform: [{ translateY: anims[i].translateY }],
              position: i === 0 ? 'relative' : 'absolute',
            },
          ]}
        >
          {word}
        </Animated.Text>
      ))}
    </View>
  );
}

/* ── ScrollIndicator ─────────────────────────────────────────────────── */
function ScrollIndicator() {
  const bounce = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 8, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
    Animated.timing(fadeIn, { toValue: 1, duration: 1200, delay: 1500, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[hs.scrollIndicator, { opacity: fadeIn, transform: [{ translateY: bounce }] }]}>
      <View style={hs.scrollLine} />
    </Animated.View>
  );
}

/* ── Main hero ───────────────────────────────────────────────────────── */
interface Props {
  scrollY: Animated.Value;
  onGetStarted: () => void;
}

export function HeroSection({ scrollY, onGetStarted }: Props) {
  const { height: screenH, width: screenW } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const h1O = useRef(new Animated.Value(0)).current;
  const h1TY = useRef(new Animated.Value(40)).current;
  const subO = useRef(new Animated.Value(0)).current;
  const subTY = useRef(new Animated.Value(30)).current;
  const ctaO = useRef(new Animated.Value(0)).current;
  const ctaTY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const a = (o: Animated.Value, ty: Animated.Value, delay: number) =>
      Animated.parallel([
        Animated.timing(o, { toValue: 1, duration: 800, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.spring(ty, { toValue: 0, friction: 10, tension: 40, delay, useNativeDriver: true }),
      ]);

    Animated.stagger(150, [
      a(h1O, h1TY, 500),
      a(subO, subTY, 650),
      a(ctaO, ctaTY, 800),
    ]).start();
  }, []);

  const btnScale1 = useRef(new Animated.Value(1)).current;
  const btnScale2 = useRef(new Animated.Value(1)).current;

  return (
    <View style={[hs.root, { minHeight: screenH }]}>
      {/* Animated particle background */}
      <Antigravity
        count={250}
        magnetRadius={8}
        ringRadius={8}
        waveSpeed={0.4}
        waveAmplitude={1}
        particleSize={1}
        lerpSpeed={0.06}
        color="#ffffff"
        autoAnimate
        interactive={false}
        particleVariance={1}
        rotationSpeed={0}
        depthFactor={1}
        pulseSpeed={3}
        particleShape="capsule"
        fieldStrength={10}
      />

      {/* Content layer */}
      <View style={[hs.content, { paddingTop: insets.top + 60, pointerEvents: 'box-none' }]}>
        <Animated.View style={[hs.headingWrap, { opacity: h1O, transform: [{ translateY: h1TY }] }]}>
          <Text style={[hs.heading, { maxWidth: screenW * 0.92 }]}>{'The creator\nplatform to'}</Text>
          <RotatingWord />
        </Animated.View>

        <Animated.View style={[hs.subWrap, { opacity: subO, transform: [{ translateY: subTY }] }]}>
          <Text style={[hs.subtitle, { maxWidth: screenW * 0.88 }]}>
            Connect with top brands, create UGC content, and earn from your first campaign to your thousandth.
          </Text>
        </Animated.View>

        <Animated.View style={[hs.ctaRow, { opacity: ctaO, transform: [{ translateY: ctaTY }] }]}>
          <Pressable
            onPressIn={() => Animated.spring(btnScale1, { toValue: 0.94, friction: 8, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(btnScale1, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
          >
            <Animated.View style={[hs.btnOutline, { transform: [{ scale: btnScale1 }] }]}>
              <Text style={hs.btnOutlineText}>Learn more</Text>
            </Animated.View>
          </Pressable>

          <Pressable
            onPressIn={() => Animated.spring(btnScale2, { toValue: 0.94, friction: 8, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(btnScale2, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
            onPress={onGetStarted}
          >
            <Animated.View style={[hs.btnPrimary, { transform: [{ scale: btnScale2 }] }]}>
              <Text style={hs.btnPrimaryText}>Get started</Text>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </View>

      <ScrollIndicator />
    </View>
  );
}

/* ── Styles ───────────────────────────────────────────────────────────── */
const hs = StyleSheet.create({
  root: { flex: 1, backgroundColor: D.bg, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, zIndex: 2 },

  headingWrap: { alignItems: 'center', marginBottom: 8 },
  heading: { fontSize: 48, fontWeight: '800', color: D.ink, letterSpacing: -2.5, lineHeight: 54, textAlign: 'center' },

  rotatingWrap: { height: 58, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  rotatingWord: { fontSize: 48, fontWeight: '800', letterSpacing: -2.5, lineHeight: 58, textAlign: 'center', color: D.subtle },

  subWrap: { marginTop: 28, marginBottom: 40 },
  subtitle: { fontSize: 18, lineHeight: 28, color: D.muted, textAlign: 'center', letterSpacing: -0.2 },

  ctaRow: { flexDirection: 'row', gap: 14 },
  btnOutline: {
    paddingHorizontal: 24, paddingVertical: 16, borderRadius: 14,
    borderWidth: 1.5, borderColor: D.border, backgroundColor: 'transparent',
  },
  btnOutlineText: { fontSize: 16, fontWeight: '700', color: D.ink, letterSpacing: -0.3 },
  btnPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 24, paddingVertical: 16, borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#000000', letterSpacing: -0.3 },

  scrollIndicator: { alignItems: 'center', paddingBottom: 20, zIndex: 2 },
  scrollLine: { width: 2, height: 32, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.20)' },
});

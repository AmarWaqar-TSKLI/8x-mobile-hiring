/**
 * Navbar — Adaptive navbar + full-screen staggered slide-in menu
 *
 * Transitions from transparent over dark hero → solid white on scroll.
 * Hamburger button in the bar opens a full-screen menu that slides in
 * from the right with staggered color layers. A prominent close (cross)
 * button appears at the top-right of the open panel. Menu items stagger
 * in with translateY + rotation. Uniform-size social icon circles at
 * the bottom. Works on all platforms (mobile, tablet, web).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  Platform,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from './constants';
import { useEntrance } from './hooks';

const SCREEN_W = Dimensions.get('window').width;

/* ── Menu data ────────────────────────────────────────────────────────── */
const MENU_ITEMS = [
  { label: 'Products', num: '01' },
  { label: 'Creators', num: '02' },
  { label: 'For Brands', num: '03' },
  { label: 'Pricing', num: '04' },
  { label: 'About', num: '05' },
];

const SOCIAL_ITEMS: { label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { label: 'Twitter', icon: 'logo-twitter' },
  { label: 'Instagram', icon: 'logo-instagram' },
  { label: 'YouTube', icon: 'logo-youtube' },
  { label: 'LinkedIn', icon: 'logo-linkedin' },
];

/* ── Full-screen staggered menu ───────────────────────────────────────── */
function FullScreenMenu({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { width: winW, height: winH } = useWindowDimensions();

  /* Master progress drives the panel slide */
  const anim = useRef(new Animated.Value(0)).current;
  /* Per-item entrance anims */
  const itemAnims = useRef(MENU_ITEMS.map(() => new Animated.Value(0))).current;
  const socialAnim = useRef(new Animated.Value(0)).current;
  const closeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset sub-animations
      itemAnims.forEach(a => a.setValue(0));
      socialAnim.setValue(0);
      closeAnim.setValue(0);

      // 1) Slide panels in
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        // 2) Close button pop
        Animated.spring(closeAnim, {
          toValue: 1, friction: 8, tension: 80,
          useNativeDriver: true,
        }).start();

        // 3) Stagger menu items
        Animated.stagger(
          80,
          itemAnims.map(a =>
            Animated.spring(a, { toValue: 1, friction: 10, tension: 60, useNativeDriver: true })
          )
        ).start();

        // 4) Socials fade in
        Animated.timing(socialAnim, {
          toValue: 1, duration: 400, delay: MENU_ITEMS.length * 60,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Close — fast out
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Use latest winW for slide offset so it works on rotation / resize
  const slideW = winW || SCREEN_W;

  // Layer 1 (accent) — slides first
  const layer1X = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [slideW, 0],
  });
  // Layer 2 (darker) — slightly delayed
  const layer2X = anim.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [slideW, slideW, 0],
  });
  // White panel — last
  const panelX = anim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [slideW, slideW, 0],
  });
  const panelOpacity = anim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  });

  // Close button
  const closeScale = closeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const closeRotate = closeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  // Lazy mount / unmount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (visible) setMounted(true);
    else {
      const t = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <View
      style={[
        ms.overlay,
        Platform.OS === 'web'
          ? { position: 'fixed' as any, width: winW, height: winH }
          : { width: winW, height: winH },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* Tap-to-close backdrop */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      {/* Color layer 1 — accent */}
      <Animated.View
        style={[ms.layer, { backgroundColor: C.accent, transform: [{ translateX: layer1X }] }]}
        pointerEvents="none"
      />

      {/* Color layer 2 — darker accent */}
      <Animated.View
        style={[ms.layer, { backgroundColor: '#4A42E0', transform: [{ translateX: layer2X }] }]}
        pointerEvents="none"
      />

      {/* White content panel */}
      <Animated.View
        style={[
          ms.panel,
          {
            paddingTop: Math.max(insets.top, 20) + 16,
            paddingBottom: Math.max(insets.bottom, 20) + 16,
            opacity: panelOpacity,
            transform: [{ translateX: panelX }],
          },
        ]}
      >
        {/* ── Close button (top-right) ─────────────────────────────── */}
        <View style={ms.closeRow}>
          <Pressable onPress={onClose} hitSlop={12}>
            <Animated.View
              style={[
                ms.closeBtn,
                { transform: [{ scale: closeScale }, { rotate: closeRotate }] },
              ]}
            >
              <Ionicons name="close" size={22} color="#FFF" />
            </Animated.View>
          </Pressable>
        </View>

        {/* ── Menu items ───────────────────────────────────────────── */}
        <View style={ms.itemList}>
          {MENU_ITEMS.map((item, i) => {
            const itemTY = itemAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: [60, 0],
            });
            const itemRotate = itemAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: ['8deg', '0deg'],
            });
            const itemOpacity = itemAnims[i];

            return (
              <Pressable
                key={item.label}
                style={({ pressed }) => [ms.itemWrap, pressed && ms.itemPressed]}
                onPress={onClose}
              >
                <Animated.View
                  style={{
                    opacity: itemOpacity,
                    transform: [{ translateY: itemTY }, { rotate: itemRotate }],
                  }}
                >
                  <View style={ms.itemRow}>
                    <Text style={ms.itemLabel}>{item.label}</Text>
                    <Text style={ms.itemNum}>{item.num}</Text>
                  </View>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>

        {/* ── Socials (uniform circles) ────────────────────────────── */}
        <Animated.View style={[ms.socials, { opacity: socialAnim }]}>
          <Text style={ms.socialsTitle}>Socials</Text>
          <View style={ms.socialsRow}>
            {SOCIAL_ITEMS.map((item) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [ms.socialCircle, pressed && ms.socialCirclePressed]}
              >
                <Ionicons name={item.icon} size={20} color={C.accent} />
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

/* ── Main Navbar ──────────────────────────────────────────────────────── */
export function Navbar({ scrollY, insetTop, onSignIn, onGetStarted }: {
  scrollY: Animated.Value; insetTop: number; onSignIn: () => void; onGetStarted: () => void;
}) {
  const { height: screenH } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setMenuOpen(v => !v), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const heroEnd = screenH * 0.7;

  const bgOpacity = scrollY.interpolate({
    inputRange: [heroEnd - 100, heroEnd],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const borderOpacity = scrollY.interpolate({
    inputRange: [heroEnd - 50, heroEnd],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const lightOpacity = scrollY.interpolate({
    inputRange: [heroEnd - 100, heroEnd],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const darkOpacity = scrollY.interpolate({
    inputRange: [heroEnd - 100, heroEnd],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const { opacity, translateY } = useEntrance(0);

  return (
    <>
      {/* Navbar bar */}
      <Animated.View style={[ns.wrapper, { paddingTop: insetTop + 8, opacity, transform: [{ translateY }] }]}>
        <Animated.View style={[ns.bgFill, { opacity: bgOpacity }]} />
        <Animated.View style={[ns.borderLine, { opacity: borderOpacity }]} />

        <View style={ns.inner}>
          {/* Logo */}
          <View>
            <Animated.Text style={[ns.logo, ns.logoLight, { opacity: lightOpacity }]}>8x</Animated.Text>
            <Animated.Text style={[ns.logo, ns.logoDark, { opacity: darkOpacity }]}>8x</Animated.Text>
          </View>

          {/* Right side */}
          <View style={ns.right}>
            <Pressable onPress={onSignIn}>
              <View>
                <Animated.Text style={[ns.signIn, ns.linkLight, { opacity: lightOpacity }]}>Sign in</Animated.Text>
                <Animated.Text style={[ns.signIn, ns.linkDark, { opacity: darkOpacity }]}>Sign in</Animated.Text>
              </View>
            </Pressable>

            <Pressable onPress={onGetStarted}>
              <Animated.View style={[ns.ctaSmall, ns.ctaLight, { opacity: lightOpacity }]}>
                <Text style={ns.ctaText}>Get started</Text>
              </Animated.View>
              <Animated.View style={[ns.ctaSmall, ns.ctaDark, { opacity: darkOpacity }]}>
                <Text style={ns.ctaText}>Get started</Text>
              </Animated.View>
            </Pressable>

            {/* Hamburger button */}
            <Pressable onPress={toggleMenu} hitSlop={12} style={ns.menuBtn}>
              <View>
                <Animated.View style={{ opacity: lightOpacity }}>
                  <View style={ns.barGroup}>
                    <View style={[ns.bar, { backgroundColor: '#FFF' }]} />
                    <View style={[ns.bar, { backgroundColor: '#FFF' }]} />
                    <View style={[ns.bar, { backgroundColor: '#FFF' }]} />
                  </View>
                </Animated.View>
                <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, { opacity: darkOpacity }]}>
                  <View style={ns.barGroup}>
                    <View style={[ns.bar, { backgroundColor: C.ink }]} />
                    <View style={[ns.bar, { backgroundColor: C.ink }]} />
                    <View style={[ns.bar, { backgroundColor: C.ink }]} />
                  </View>
                </Animated.View>
              </View>
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {/* Full-screen menu overlay */}
      <FullScreenMenu visible={menuOpen} onClose={closeMenu} />
    </>
  );
}

/* ── Navbar styles ────────────────────────────────────────────────────── */
const ns = StyleSheet.create({
  wrapper: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    paddingBottom: 12,
  },
  bgFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(250,250,250,0.96)',
  },
  borderLine: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 1, backgroundColor: C.border,
  },
  inner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logo: { fontSize: 24, fontWeight: '800', letterSpacing: -1.5 },
  logoLight: { color: '#FFF' },
  logoDark: { color: C.ink, position: 'absolute', top: 0, left: 0 },
  linkLight: { color: 'rgba(255,255,255,0.75)' },
  linkDark: { color: C.inkSoft, position: 'absolute', top: 0, left: 0 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  signIn: { fontSize: 14, fontWeight: '600' },
  ctaSmall: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  ctaLight: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  ctaDark: {
    backgroundColor: C.accent,
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  ctaText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  menuBtn: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  barGroup: { width: 22, height: 18, justifyContent: 'space-between' },
  bar: { width: 22, height: 2.5, borderRadius: 2 },
});

/* ── Full-screen menu styles ──────────────────────────────────────────── */
const SOCIAL_SIZE = 46;

const ms = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0,
    zIndex: 200,
  },
  layer: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0,
    width: '100%',
  },
  panel: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    justifyContent: 'flex-start',
  },

  /* Close button */
  closeRow: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Menu items */
  itemList: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  itemWrap: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  itemPressed: {
    backgroundColor: C.accentBg,
    borderRadius: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontSize: 32,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -1.2,
    textTransform: 'uppercase',
  },
  itemNum: {
    fontSize: 14,
    fontWeight: '500',
    color: C.accent,
  },

  /* Socials — uniform circles */
  socials: {
    gap: 14,
    paddingTop: 20,
  },
  socialsTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: C.accent,
    textTransform: 'uppercase',
  },
  socialsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialCircle: {
    width: SOCIAL_SIZE,
    height: SOCIAL_SIZE,
    borderRadius: SOCIAL_SIZE / 2,
    backgroundColor: C.accentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialCirclePressed: {
    backgroundColor: C.accent + '30',
  },
});

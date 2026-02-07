/**
 * TestimonialsSection — 3D perspective marquee with scroll-driven vertical columns
 *
 * - Columns translate vertically as the user scrolls the page
 * - Alternating scroll directions per column
 * - 3D perspective transform (rotateX, rotateY, rotateZ)
 * - Gradient fade overlays on all edges
 * - Premium dark cards with avatar, name, handle, country, review text
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from './constants';

/* ── Testimonial data ────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    handle: '@sarah',
    body: '8x completely changed how I work with brands. The payouts are fast!',
    img: 'https://randomuser.me/api/portraits/women/32.jpg',
    country: '🇺🇸 USA',
  },
  {
    name: 'Priya Sharma',
    handle: '@priya',
    body: 'The quality of brands on 8x is unmatched. Tripled my income!',
    img: 'https://randomuser.me/api/portraits/women/53.jpg',
    country: '🇮🇳 India',
  },
  {
    name: 'Mateo Rossi',
    handle: '@mateo',
    body: 'Campaign matching is incredible. Found my perfect niche!',
    img: 'https://randomuser.me/api/portraits/men/51.jpg',
    country: '🇮🇹 Italy',
  },
  {
    name: 'James Chen',
    handle: '@james',
    body: '8x handles everything — matching, contracts, payments. It just works.',
    img: 'https://randomuser.me/api/portraits/men/33.jpg',
    country: '🇬🇧 UK',
  },
  {
    name: 'Elena Rodriguez',
    handle: '@elena',
    body: 'Transparent rates, no haggling, instant payouts. Love it!',
    img: 'https://randomuser.me/api/portraits/women/45.jpg',
    country: '🇪🇸 Spain',
  },
  {
    name: 'Marcus Johnson',
    handle: '@marcus',
    body: 'As a micro-creator, brands finally find me through 8x.',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    country: '🇨🇦 Canada',
  },
  {
    name: 'Yuki Tanaka',
    handle: '@yuki',
    body: 'The dashboard saves me hours tracking campaigns!',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    country: '🇯🇵 Japan',
  },
  {
    name: 'David Kim',
    handle: '@david',
    body: 'Best creator platform I\'ve ever used. Period.',
    img: 'https://randomuser.me/api/portraits/men/85.jpg',
    country: '🇰🇷 Korea',
  },
  {
    name: 'Sophie Laurent',
    handle: '@sophie',
    body: 'Went from 0 to 50 brand deals in 6 months!',
    img: 'https://randomuser.me/api/portraits/women/90.jpg',
    country: '🇫🇷 France',
  },
];

type Testimonial = (typeof TESTIMONIALS)[number];

/* ── Card component ──────────────────────────────────────────────────── */
function TestimonialCard({ item, cardW }: { item: Testimonial; cardW: number }) {
  return (
    <View style={[ts.card, { width: cardW }]}>
      <View style={ts.cardHeader}>
        <Image source={{ uri: item.img }} style={ts.avatar} />
        <View style={ts.nameCol}>
          <View style={ts.nameRow}>
            <Text style={ts.name} numberOfLines={1}>{item.name}</Text>
            <Text style={ts.country}>{item.country}</Text>
          </View>
          <Text style={ts.handle}>{item.handle}</Text>
        </View>
      </View>
      <Text style={ts.body}>{item.body}</Text>
    </View>
  );
}

/* ── Single vertical marquee column (scroll-driven) ──────────────────── */
function MarqueeColumn({ items, reverse, columnH, cardW, scrollY, speed }: {
  items: Testimonial[];
  reverse: boolean;
  columnH: number;
  cardW: number;
  scrollY: Animated.Value;
  speed: number;
}) {
  const CARD_H = 130;
  const GAP = 10;
  const totalH = items.length * (CARD_H + GAP);

  // Drive column translation from page scrollY
  // Each column moves at a slightly different speed for depth
  const range = totalH * 1.5;
  const translateY = scrollY.interpolate({
    inputRange: [0, 6000],
    outputRange: reverse ? [range * speed, -range * speed] : [-range * speed, range * speed],
    extrapolate: 'clamp',
  });

  // Repeat items 3x for seamless coverage
  const repeated = [...items, ...items, ...items];

  return (
    <View style={[ts.columnClip, { height: columnH }]}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {repeated.map((item, i) => (
          <View key={`${item.handle}-${i}`} style={{ marginBottom: GAP }}>
            <TestimonialCard item={item} cardW={cardW} />
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

/* ── Main section ────────────────────────────────────────────────────── */
export function TestimonialsSection({ scrollY }: { scrollY: Animated.Value }) {
  const { width: screenW } = useWindowDimensions();

  // Entrance animation
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 1000, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, friction: 12, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  // Taller marquee for more immersion
  const MARQUEE_H = 820;
  const NUM_COLS = screenW > 500 ? 4 : 3;
  const COL_GAP = 8;
  const SIDE_PAD = 0;
  const cardW = (screenW - SIDE_PAD * 2 - COL_GAP * (NUM_COLS - 1)) / NUM_COLS;

  // Split testimonials into columns
  const columns: Testimonial[][] = Array.from({ length: NUM_COLS }, () => []);
  TESTIMONIALS.forEach((t, i) => {
    columns[i % NUM_COLS].push(t);
  });

  return (
    <View style={ts.section}>
      {/* Section header */}
      <View style={ts.headerWrap}>
        <Text style={ts.eyebrow}>LOVED BY CREATORS</Text>
        <Text style={ts.sectionTitle}>
          Don't take our word{'\n'}for it.
        </Text>
      </View>

      {/* 3D Marquee */}
      <Animated.View
        style={[
          ts.marqueeOuter,
          {
            height: MARQUEE_H,
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
          },
        ]}
      >
        {/* 3D perspective wrapper */}
        <View style={ts.perspectiveWrap}>
          <View
            style={[
              ts.columnsRow,
              {
                gap: COL_GAP,
                transform: [
                  { perspective: 300 },
                  { rotateX: '20deg' },
                  { rotateY: '-10deg' },
                  { rotateZ: '20deg' },
                  { translateX: -(screenW * 0.12) },
                ],
              },
            ]}
          >
            {columns.map((col, i) => (
              <MarqueeColumn
                key={i}
                items={col}
                reverse={i % 2 === 1}
                columnH={MARQUEE_H + 100}
                cardW={cardW}
                scrollY={scrollY}
                speed={0.8 + i * 0.15}
              />
            ))}
          </View>
        </View>

        {/* Gradient overlays */}
        <LinearGradient
          colors={['#0A0A0A', 'transparent']}
          style={[ts.gradientTop, { pointerEvents: 'none' }]}
        />
        <LinearGradient
          colors={['transparent', '#0A0A0A']}
          style={[ts.gradientBottom, { pointerEvents: 'none' }]}
        />
        <LinearGradient
          colors={['#0A0A0A', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[ts.gradientLeft, { pointerEvents: 'none' }]}
        />
        <LinearGradient
          colors={['transparent', '#0A0A0A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[ts.gradientRight, { pointerEvents: 'none' }]}
        />
      </Animated.View>
    </View>
  );
}

/* ── Styles ───────────────────────────────────────────────────────────── */
const ts = StyleSheet.create({
  section: {
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: C.bg,
  },

  headerWrap: {
    paddingHorizontal: 28,
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: C.accent,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: C.ink,
    lineHeight: 36,
    letterSpacing: -1.5,
  },

  /* Marquee area */
  marqueeOuter: {
    overflow: 'hidden',
    borderRadius: 0,
    marginHorizontal: 0,
    backgroundColor: '#0A0A0A',
  },

  perspectiveWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  columnsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  columnClip: {
    overflow: 'hidden',
  },

  /* Card */
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  nameCol: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  country: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
  },
  handle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 1,
  },
  body: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.65)',
  },

  /* Gradient overlays */
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 130,
    zIndex: 2,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
    zIndex: 2,
  },
  gradientLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 80,
    zIndex: 2,
  },
  gradientRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 80,
    zIndex: 2,
  },
});

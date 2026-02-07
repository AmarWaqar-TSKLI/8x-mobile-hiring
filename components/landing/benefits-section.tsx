/**
 * BenefitsSection — scroll-driven animated grid à la GridMotion
 *
 * 4 rows of benefit cards on a tilted plane.
 * Rows translate horizontally (alternating directions) based on scrollY.
 * Dark background with gradient fade edges for depth.
 * Content: value propositions for Creators and Companies.
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from './constants';

/* ── Benefit cards data ───────────────────────────────────────────────── */
const CREATOR_BENEFITS = [
  { icon: '◆', accent: C.accent, title: 'Monetize Your Skills', body: 'Turn your creativity into reliable income with paid brand campaigns.' },
  { icon: '▲', accent: C.accentAlt, title: 'Gain Top Exposure', body: 'Get discovered by 200+ brands actively seeking fresh voices.' },
  { icon: '◈', accent: C.accent, title: 'No Follower Minimum', body: 'Micro or macro — your content quality is what matters here.' },
  { icon: '◎', accent: C.accentAlt, title: 'Instant Payouts', body: 'Get paid on time, every time, directly to your bank account.' },
  { icon: '⬡', accent: C.accent, title: 'Smart Matching AI', body: 'Our algorithm pairs you with brands that fit your style & niche.' },
  { icon: '◇', accent: C.accentAlt, title: 'Performance Analytics', body: 'Track views, engagement, and earnings in one clean dashboard.' },
  { icon: '✦', accent: C.accent, title: 'Creative Freedom', body: 'Briefs guide you — you decide how to bring the story to life.' },
];

const BRAND_BENEFITS = [
  { icon: '❖', accent: '#FF7A00', title: 'Hire Vetted Talent', body: 'Every creator is reviewed for quality before they appear on 8x.' },
  { icon: '▣', accent: C.pink, title: 'Streamlined Projects', body: 'Manage briefs, approvals, and payments in one workflow.' },
  { icon: '◉', accent: '#FF7A00', title: 'Targeted Reach', body: 'Find creators in the exact niche your audience cares about.' },
  { icon: '♫', accent: C.pink, title: 'Scalable Campaigns', body: 'Launch 10 or 100 creator partnerships with the same effort.' },
  { icon: '☆', accent: '#FF7A00', title: 'Real-Time Insights', body: 'See content performance as it happens — no waiting for reports.' },
  { icon: '◆', accent: C.pink, title: 'Cost Transparency', body: 'Know creator rates upfront. No hidden fees, no surprises.' },
  { icon: '▲', accent: '#FF7A00', title: 'Global Talent Pool', body: 'Access creators across 30+ countries and every content vertical.' },
];

type BenefitItem = { icon: string; accent: string; title: string; body: string };

/* ── Single card ──────────────────────────────────────────────────────── */
function BenefitCard({ item, cardW }: { item: BenefitItem; cardW: number }) {
  return (
    <View style={[bs.card, { width: cardW }]}>
      <View style={[bs.iconCircle, { backgroundColor: item.accent + '18' }]}>
        <Text style={[bs.icon, { color: item.accent }]}>{item.icon}</Text>
      </View>
      <Text style={bs.cardTitle}>{item.title}</Text>
      <Text style={bs.cardBody}>{item.body}</Text>
    </View>
  );
}

/* ── Label card (Creators / Companies) ────────────────────────────────── */
function LabelCard({ label, sub, accent, cardW }: { label: string; sub: string; accent: string; cardW: number }) {
  return (
    <View style={[bs.labelCard, { width: cardW }]}>
      <Text style={[bs.labelTitle, { color: accent }]}>{label}</Text>
      <Text style={bs.labelSub}>{sub}</Text>
    </View>
  );
}

/* ── Animated row (scroll-driven horizontal translation) ──────────────── */
function GridRow({ items, reverse, cardW, scrollY, speed, gap }: {
  items: (BenefitItem | { _label: true; label: string; sub: string; accent: string })[];
  reverse: boolean;
  cardW: number;
  scrollY: Animated.Value;
  speed: number;
  gap: number;
}) {
  const maxShift = 200;
  const translateX = scrollY.interpolate({
    inputRange: [0, 5000],
    outputRange: reverse ? [maxShift * speed, -maxShift * speed] : [-maxShift * speed, maxShift * speed],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[bs.row, { gap, transform: [{ translateX }] }]}>
      {items.map((item, i) => {
        if ('_label' in item) {
          return <LabelCard key={`label-${i}`} label={item.label} sub={item.sub} accent={item.accent} cardW={cardW} />;
        }
        return <BenefitCard key={`card-${i}`} item={item} cardW={cardW} />;
      })}
    </Animated.View>
  );
}

/* ── Main section ─────────────────────────────────────────────────────── */
export function BenefitsSection({ scrollY }: { scrollY: Animated.Value }) {
  const { width: screenW } = useWindowDimensions();

  // Entrance animation
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1, duration: 1000, delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideUp, {
        toValue: 0, friction: 12, delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const GRID_H = 750;
  const GAP = 10;
  const cardW = Math.max(140, screenW * 0.35);

  // Build 4 rows mixing creator and brand benefits with label cards
  const row1: any[] = [
    { _label: true, label: 'FOR CREATORS', sub: 'Monetize your craft', accent: C.accent },
    CREATOR_BENEFITS[0], CREATOR_BENEFITS[1], CREATOR_BENEFITS[2],
    BRAND_BENEFITS[0], BRAND_BENEFITS[1],
    CREATOR_BENEFITS[0], CREATOR_BENEFITS[1], // Repeat for coverage
  ];
  const row2: any[] = [
    BRAND_BENEFITS[2], BRAND_BENEFITS[3], CREATOR_BENEFITS[3],
    { _label: true, label: 'FOR BRANDS', sub: 'Scale with creators', accent: '#FF7A00' },
    CREATOR_BENEFITS[4], BRAND_BENEFITS[4],
    BRAND_BENEFITS[2], BRAND_BENEFITS[3], // Repeat
  ];
  const row3: any[] = [
    CREATOR_BENEFITS[5], BRAND_BENEFITS[5],
    { _label: true, label: 'FOR CREATORS', sub: 'Grow your career', accent: C.accentAlt },
    CREATOR_BENEFITS[6], BRAND_BENEFITS[6],
    CREATOR_BENEFITS[5], BRAND_BENEFITS[5], CREATOR_BENEFITS[6], // Repeat
  ];
  const row4: any[] = [
    BRAND_BENEFITS[0], CREATOR_BENEFITS[1], BRAND_BENEFITS[3],
    CREATOR_BENEFITS[4], BRAND_BENEFITS[5],
    { _label: true, label: 'FOR BRANDS', sub: 'Find perfect talent', accent: C.pink },
    BRAND_BENEFITS[0], CREATOR_BENEFITS[1], // Repeat
  ];

  return (
    <View style={bs.section}>
      {/* Section header */}
      <View style={bs.headerWrap}>
        <Text style={bs.eyebrow}>WHY 8X</Text>
        <Text style={bs.sectionTitle}>
          Built for both sides{'\n'}of the deal.
        </Text>
        <Text style={bs.sectionSub}>
          Whether you create content or commission it — 8x gives you an unfair advantage.
        </Text>
      </View>

      {/* Animated grid */}
      <Animated.View
        style={[
          bs.gridOuter,
          {
            height: GRID_H,
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
          },
        ]}
      >
        {/* Tilted grid plane */}
        <View style={bs.perspectiveWrap}>
          <View
            style={[
              bs.gridPlane,
              {
                gap: GAP,
                transform: [
                  { perspective: 400 },
                  { rotateX: '18deg' },
                  { rotateY: '-8deg' },
                  { rotateZ: '15deg' },
                  { scale: 0.95 },
                ],
              },
            ]}
          >
            <GridRow items={row1} reverse={false} cardW={cardW} scrollY={scrollY} speed={0.8} gap={GAP} />
            <GridRow items={row2} reverse={true} cardW={cardW} scrollY={scrollY} speed={1.0} gap={GAP} />
            <GridRow items={row3} reverse={false} cardW={cardW} scrollY={scrollY} speed={0.7} gap={GAP} />
            <GridRow items={row4} reverse={true} cardW={cardW} scrollY={scrollY} speed={0.9} gap={GAP} />
          </View>
        </View>

        {/* Gradient fades */}
        <LinearGradient
          colors={[C.bg, 'transparent']}
          style={[bs.gradTop, { pointerEvents: 'none' as const }]}
        />
        <LinearGradient
          colors={['transparent', C.bg]}
          style={[bs.gradBottom, { pointerEvents: 'none' as const }]}
        />
        <LinearGradient
          colors={[C.bg, 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[bs.gradLeft, { pointerEvents: 'none' as const }]}
        />
        <LinearGradient
          colors={['transparent', C.bg]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[bs.gradRight, { pointerEvents: 'none' as const }]}
        />
      </Animated.View>
    </View>
  );
}

/* ── Styles ───────────────────────────────────────────────────────────── */
const bs = StyleSheet.create({
  section: {
    paddingTop: 56,
    paddingBottom: 24,
    backgroundColor: C.bg,
  },

  /* Header */
  headerWrap: { paddingHorizontal: 28, marginBottom: 16 },
  eyebrow: {
    fontSize: 11, fontWeight: '700', letterSpacing: 2.5,
    color: C.accent, marginBottom: 12, textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 30, fontWeight: '800', color: C.ink,
    lineHeight: 36, letterSpacing: -1.5, marginBottom: 12,
  },
  sectionSub: {
    fontSize: 15, lineHeight: 22, color: C.muted,
  },

  /* Grid */
  gridOuter: {
    overflow: 'hidden',
    borderRadius: 0,
    marginHorizontal: 0,
  },
  perspectiveWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridPlane: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  /* Benefit card */
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
    elevation: 1,
    minHeight: 140,
  },
  iconCircle: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  icon: { fontSize: 16, fontWeight: '700' },
  cardTitle: {
    fontSize: 14, fontWeight: '700', color: C.ink,
    letterSpacing: -0.3, marginBottom: 6,
  },
  cardBody: {
    fontSize: 12, lineHeight: 18, color: C.muted,
  },

  /* Label card */
  labelCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    minHeight: 140,
  },
  labelTitle: {
    fontSize: 11, fontWeight: '800', letterSpacing: 2,
    textTransform: 'uppercase', marginBottom: 6,
  },
  labelSub: {
    fontSize: 14, fontWeight: '600', color: C.inkSoft,
  },

  /* Gradient overlays */
  gradTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 120, zIndex: 2,
  },
  gradBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 120, zIndex: 2,
  },
  gradLeft: {
    position: 'absolute', top: 0, bottom: 0, left: 0,
    width: 60, zIndex: 2,
  },
  gradRight: {
    position: 'absolute', top: 0, bottom: 0, right: 0,
    width: 60, zIndex: 2,
  },
});

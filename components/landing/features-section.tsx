/**
 * FeaturesSection — CardSwap auto-cycling 3D stack
 *
 * Cards fan out in a stacked perspective layout and auto-swap:
 * the front card drops away, the rest promote forward, then
 * the dropped card reappears at the back of the stack.
 *
 * Pure React Native Animated — no GSAP.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { C, FEATURES } from './constants';

/* ── Tunables ─────────────────────────────────────────── */
const CARD_W       = 300;     // card width
const CARD_H       = 380;     // card height
const DIST_X       = 50;      // horizontal offset per card
const DIST_Y       = 55;      // vertical offset per card (upward)
const STACK_TOP_GAP = 24;     // gap between header and top card
const SKEW         = '4deg';  // slight skew for 3D feel
const SWAP_DELAY   = 4000;    // ms between swaps
const DROP_DUR     = 700;     // drop-out duration
const PROMOTE_DUR  = 600;     // promote-forward duration
const RETURN_DUR   = 600;     // return-to-back duration

const THEMES = [
  { bg: '#0B0B0B', fg: '#FFFFFF', dim: 'rgba(255,255,255,0.06)' },
  { bg: C.accent,  fg: '#FFFFFF', dim: 'rgba(255,255,255,0.15)' },
];

/* ── Slot calculator ──────────────────────────────────── */
interface Slot { x: number; y: number; zIndex: number }
const getSlot = (i: number, total: number, baseOffset: number): Slot => ({
  x: i * DIST_X,
  y: baseOffset - i * DIST_Y,
  zIndex: total - i,
});

/* ── Single Card ──────────────────────────────────────── */
interface SwapCardProps {
  feature: (typeof FEATURES)[number];
  featureIndex: number;
  animX: Animated.Value;
  animY: Animated.Value;
  animOpacity: Animated.Value;
  animScale: Animated.Value;
  zIndex: number;
  cardW: number;
  cardH: number;
}

function SwapCard({
  feature, featureIndex, animX, animY, animOpacity, animScale, zIndex, cardW, cardH,
}: SwapCardProps) {
  const theme = THEMES[featureIndex % THEMES.length];

  return (
    <Animated.View
      style={[
        cs.card,
        {
          width: cardW,
          height: cardH,
          zIndex,
          backgroundColor: theme.bg,
          transform: [
            { translateX: animX },
            { translateY: animY },
            { scale: animScale },
            { skewY: SKEW },
          ],
          opacity: animOpacity,
        },
      ]}
    >
      {/* Large watermark number */}
      <Text style={[cs.watermark, { color: theme.dim }]}>
        0{featureIndex + 1}
      </Text>

      {/* Icon bubble */}
      <View style={[cs.iconBubble, { backgroundColor: theme.dim }]}>
        <Text style={cs.iconText}>{feature.icon}</Text>
      </View>

      {/* Content */}
      <View style={cs.content}>
        <Text style={[cs.title, { color: theme.fg }]}>{feature.title}</Text>
        <Text style={[cs.body, { color: theme.fg }]}>{feature.body}</Text>
      </View>
    </Animated.View>
  );
}

const cs = StyleSheet.create({
  card: {
    position: 'absolute',
    borderRadius: 22,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 16px 40px rgba(0,0,0,0.3)' }
      : { elevation: 10 }),
  },
  watermark: {
    position: 'absolute',
    top: 16,
    right: 20,
    fontSize: 100,
    fontWeight: '900',
    letterSpacing: -6,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginLeft: 24,
  },
  iconText: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.75,
  },
});

/* ── CardSwap Section ─────────────────────────────────── */
export function FeaturesSection({ scrollY }: { scrollY: Animated.Value }) {
  const { width: screenW } = useWindowDimensions();
  const total = FEATURES.length;

  // Responsive card sizing
  const cardW = Math.min(CARD_W, screenW - 80);
  const cardH = CARD_H;

  // Animated values per card — persistent across renders
  const anims = useMemo(() =>
    FEATURES.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      scale: new Animated.Value(1),
    })),
  []);

  // Track ordering: order[0] = front card index, order[N-1] = back
  const orderRef = useRef<number[]>(Array.from({ length: total }, (_, i) => i));
  const [zIndices, setZIndices] = useState<number[]>(
    Array.from({ length: total }, (_, i) => total - i),
  );

  const baseOffset = (total - 1) * DIST_Y + STACK_TOP_GAP;

  const updateZIndices = useCallback(() => {
    const z = new Array(total).fill(0);
    orderRef.current.forEach((cardIdx, slot) => {
      z[cardIdx] = total - slot;
    });
    setZIndices([...z]);
  }, [total]);

  // Place cards immediately into their initial slots
  useEffect(() => {
    orderRef.current.forEach((cardIdx, slot) => {
      const s = getSlot(slot, total, baseOffset);
      anims[cardIdx].x.setValue(s.x);
      anims[cardIdx].y.setValue(s.y);
      anims[cardIdx].opacity.setValue(1);
      anims[cardIdx].scale.setValue(1);
    });
    updateZIndices();
  }, [baseOffset, total, updateZIndices, anims]);

  // Swap animation
  const swapRunning = useRef(false);

  const doSwap = useCallback(() => {
    if (swapRunning.current || orderRef.current.length < 2) return;
    swapRunning.current = true;

    const order = orderRef.current;
    const frontIdx = order[0];
    const frontAnim = anims[frontIdx];

    // 1. Drop front card down + fade
    Animated.parallel([
      Animated.timing(frontAnim.y, {
        toValue: 500,
        duration: DROP_DUR,
        easing: Easing.in(Easing.back(0.8)),
        useNativeDriver: true,
      }),
      Animated.timing(frontAnim.opacity, {
        toValue: 0,
        duration: DROP_DUR,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Update order: front goes to back
      const newOrder = [...order.slice(1), frontIdx];
      orderRef.current = newOrder;
      updateZIndices();

      // 3. Promote remaining cards forward
      const promotions: Animated.CompositeAnimation[] = [];
      newOrder.forEach((cardIdx, slot) => {
        if (cardIdx === frontIdx) return; // skip the dropped one for now
        const s = getSlot(slot, total, baseOffset);
        promotions.push(
          Animated.parallel([
            Animated.spring(anims[cardIdx].x, {
              toValue: s.x,
              friction: 14,
              tension: 60,
              useNativeDriver: true,
            }),
            Animated.spring(anims[cardIdx].y, {
              toValue: s.y,
              friction: 14,
              tension: 60,
              useNativeDriver: true,
            }),
          ]),
        );
      });

      Animated.stagger(60, promotions).start(() => {
        // 4. Return dropped card to back position
        const backSlot = getSlot(total - 1, total, baseOffset);
        frontAnim.x.setValue(backSlot.x + 80); // start slightly further right
        frontAnim.y.setValue(backSlot.y - 40);  // start slightly above

        Animated.parallel([
          Animated.spring(frontAnim.x, {
            toValue: backSlot.x,
            friction: 12,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.spring(frontAnim.y, {
            toValue: backSlot.y,
            friction: 12,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(frontAnim.opacity, {
            toValue: 1,
            duration: RETURN_DUR,
            useNativeDriver: true,
          }),
        ]).start(() => {
          swapRunning.current = false;
        });
      });
    });
  }, [anims, total, updateZIndices, baseOffset]);

  // Auto-cycle interval
  useEffect(() => {
    const id = setInterval(doSwap, SWAP_DELAY);
    // Do one initial swap after a short delay for entrance effect
    const firstSwap = setTimeout(doSwap, SWAP_DELAY);
    return () => {
      clearInterval(id);
      clearTimeout(firstSwap);
    };
  }, [doSwap]);

  // Container height for the card stack
  const stackH = cardH + (total - 1) * DIST_Y + 40 + baseOffset;
  const stackW = cardW + (total - 1) * DIST_X + 20;

  return (
    <View style={ss.section}>
      {/* Header */}
      <View style={ss.header}>
        <Text style={ss.eyebrow}>WHY 8X</Text>
        <Text style={ss.h2}>
          Everything you need{'\n'}to grow as a creator
        </Text>
        <Text style={ss.sub}>
          One platform. Every tool. Built for creators.
        </Text>
      </View>

      {/* Card Swap Stack */}
      <View
        style={[
          ss.stackContainer,
          {
            width: stackW,
            height: stackH,
            alignSelf: 'center',
            marginRight: -(total - 1) * DIST_X * 0.35,
          },
        ]}
      >
        {FEATURES.map((feature, i) => (
          <SwapCard
            key={feature.title}
            feature={feature}
            featureIndex={i}
            animX={anims[i].x}
            animY={anims[i].y}
            animOpacity={anims[i].opacity}
            animScale={anims[i].scale}
            zIndex={zIndices[i]}
            cardW={cardW}
            cardH={cardH}
          />
        ))}
      </View>
    </View>
  );
}

/* ── Section styles ───────────────────────────────────── */
const ss = StyleSheet.create({
  section: {
    paddingTop: 56,
    paddingBottom: 16,
    overflow: 'visible',
  },
  header: {
    paddingHorizontal: 28,
    marginBottom: 40,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.4,
    color: C.accent,
    marginBottom: 12,
  },
  h2: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -1.5,
    color: C.ink,
    marginBottom: 10,
  },
  sub: {
    fontSize: 16,
    lineHeight: 24,
    color: C.muted,
  },
  stackContainer: {
    overflow: 'visible',
  },
});

/**
 * HowItWorksSection — premium vertical timeline with scroll-driven progress line
 *
 * A vertical line grows downward as the user scrolls, connecting numbered steps.
 * Each step fades in and slides from the left when it enters the viewport.
 * Uses onLayout to measure real position + scrollY for smooth tracking.
 */
import React, { useCallback, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Platform, StyleSheet, View, Text } from 'react-native';
import { C, STEPS } from './constants';

/* Row height estimate used for scroll-driven calculations */
const ROW_H = 110;
const HEADER_H = 120; // approximate header height (eyebrow + title + margin)

/* ── Single step with dot on the timeline ────────────────────────────── */
function StepRow({
  num, title, body, index, scrollY, triggerY, isLast,
}: {
  num: string; title: string; body: string; index: number;
  scrollY: Animated.Value; triggerY: number; isLast: boolean;
}) {
  const trigger = triggerY + index * ROW_H;

  const opacity = scrollY.interpolate({
    inputRange: [trigger - 150, trigger],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const translateX = scrollY.interpolate({
    inputRange: [trigger - 150, trigger],
    outputRange: [30, 0],
    extrapolate: 'clamp',
  });
  // Dot scales up when in view
  const dotScale = scrollY.interpolate({
    inputRange: [trigger - 100, trigger + 20],
    outputRange: [0.4, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[s.stepRow, { opacity, transform: [{ translateX }] }]}>
      {/* Timeline column */}
      <View style={s.timelineCol}>
        <Animated.View style={[s.dot, { transform: [{ scale: dotScale }] }]}>
          <Text style={s.dotText}>{num}</Text>
        </Animated.View>
        {!isLast && <View style={s.connector} />}
      </View>

      {/* Content */}
      <View style={s.stepContent}>
        <Text style={s.stepTitle}>{title}</Text>
        <Text style={s.stepBody}>{body}</Text>
      </View>
    </Animated.View>
  );
}

/* ── Section ─────────────────────────────────────────────────────────── */
export function HowItWorksSection({ scrollY, contentOffset = 0 }: { scrollY: Animated.Value; contentOffset?: number }) {
  const sectionYRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [triggerY, setTriggerY] = useState(0);

  const onSectionLayout = useCallback((e: LayoutChangeEvent) => {
    // Measure relative to the scrollable parent
    const y = e.nativeEvent.layout.y;
    sectionYRef.current = y;
    setTriggerY(y + HEADER_H - 250);
    setReady(true);
  }, []);

  // Total height the progress line should cover (from first dot to last dot)
  const totalLineH = (STEPS.length - 1) * ROW_H + (STEPS.length - 1) * 32;

  // Progress line grows via scaleY (native driver can't animate height)
  const lineScale = ready
    ? scrollY.interpolate({
        inputRange: [
          triggerY,
          triggerY + STEPS.length * ROW_H,
        ],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : 0;

  return (
    <View style={s.section} onLayout={onSectionLayout}>
      <Text style={s.eyebrow}>HOW IT WORKS</Text>
      <Text style={s.sectionH2}>Five steps to{'\n'}your first payout</Text>

      {/* Timeline area */}
      <View style={s.timelineWrap}>
        {/* Background track (static grey line) */}
        <View style={s.trackLine} />
        {/* Animated progress fill — uses scaleY for native driver compat */}
        <Animated.View
          style={[
            s.progressLine,
            {
              height: totalLineH,
              transform: [{ scaleY: lineScale }],
            },
          ]}
        />

        {/* Steps */}
        {STEPS.map((step, i) => (
          <StepRow
            key={step.num}
            {...step}
            index={i}
            scrollY={scrollY}
            triggerY={triggerY}
            isLast={i === STEPS.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

/* ── Styles ───────────────────────────────────────────── */
const DOT_SIZE = 48;
const TIMELINE_LEFT = 24; // center of dot column

const s = StyleSheet.create({
  section: {
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 32,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: C.accent,
    marginBottom: 10,
  },
  sectionH2: {
    fontSize: 32,
    fontWeight: '800',
    color: C.ink,
    lineHeight: 38,
    letterSpacing: -1.5,
    marginBottom: 36,
  },

  /* Timeline container */
  timelineWrap: {
    position: 'relative',
    paddingLeft: 0,
  },
  trackLine: {
    position: 'absolute',
    left: TIMELINE_LEFT - 1.5,
    top: DOT_SIZE / 2,
    bottom: DOT_SIZE / 2,
    width: 3,
    backgroundColor: C.border,
    borderRadius: 1.5,
  },
  progressLine: {
    position: 'absolute',
    left: TIMELINE_LEFT - 1.5,
    top: DOT_SIZE / 2,
    width: 3,
    backgroundColor: C.accent,
    borderRadius: 1.5,
    zIndex: 1,
    transformOrigin: '50% 0%',
  },

  /* Step row */
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  timelineCol: {
    width: DOT_SIZE,
    alignItems: 'center',
    zIndex: 2,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 14px rgba(99, 91, 255, 0.3)' }
      : { elevation: 4 }),
  },
  dotText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.3,
  },
  connector: {
    flex: 1,
    width: 3,
    minHeight: 32,
    backgroundColor: 'transparent', // the track/progress line handles visuals
  },

  /* Content beside the dot */
  stepContent: {
    flex: 1,
    marginLeft: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  stepTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  stepBody: {
    fontSize: 15,
    lineHeight: 23,
    color: C.muted,
  },
});

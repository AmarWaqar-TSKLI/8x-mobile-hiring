/**
 * EmptyState — premium dark/blue themed empty state for feed
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { C } from './constants';

export function EmptyState() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 10,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        s.container,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={s.card}>
        {/* Decorative circles */}
        <View style={s.decoWrap}>
          <View style={[s.circle, s.circleLg]} />
          <View style={[s.circle, s.circleMd]} />
          <View style={[s.circle, s.circleSm]} />
        </View>

        {/* Icon */}
        <View style={s.iconWrap}>
          <Text style={s.icon}>📭</Text>
        </View>

        <Text style={s.title}>No campaigns yet</Text>
        <Text style={s.body}>
          New brand deals drop every day.{'\n'}
          Pull down to refresh or check back soon.
        </Text>

        {/* Pill hint */}
        <View style={s.pill}>
          <Text style={s.pillText}>↓ Pull to refresh</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#0A0A0A',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    overflow: 'hidden',
  },
  decoWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  circleLg: { width: 280, height: 280 },
  circleMd: { width: 200, height: 200 },
  circleSm: { width: 120, height: 120 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(99,91,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: { fontSize: 32 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    marginBottom: 24,
  },
  pill: {
    backgroundColor: C.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

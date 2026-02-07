import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

/** Fade-in + spring-up on mount with configurable delay. */
export function useEntrance(delay = 0) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(48)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 900, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 9, tension: 35, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return { opacity, translateY };
}

/** Simple counter that ticks from 0→end with easeOutCubic. */
export function useCounter(end: number, delay: number, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t0 = Date.now() + delay;
    const id = setInterval(() => {
      const elapsed = Date.now() - t0;
      if (elapsed < 0) return;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - progress, 3)) * end));
      if (progress >= 1) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, []);
  return value;
}

/** Continuous slow float for decorative elements. */
export function useFloat(range = 14, period = 3500) {
  const val = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(val, { toValue: 1, duration: period, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(val, { toValue: 0, duration: period, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return val.interpolate({ inputRange: [0, 1], outputRange: [-range, range] });
}

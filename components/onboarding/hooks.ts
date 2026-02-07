import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/** Fade-up entrance animation */
export function useEntrance(delay = 0) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(36)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 700, delay,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0, friction: 10, tension: 40, delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return { opacity, translateY };
}

/** Pulse scale loop (for success checkmark etc.) */
export function usePulse(minScale = 0.95, maxScale = 1.05, period = 1800) {
  const val = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(val, { toValue: 1, duration: period / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(val, { toValue: 0, duration: period / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, []);
  return val.interpolate({ inputRange: [0, 1], outputRange: [minScale, maxScale] });
}

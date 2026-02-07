/**
 * ErrorUpload — premium dark error card with retry for Upload screen
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C } from './constants';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorUpload({
  message = 'We couldn\u2019t load your content.\nPlease check your connection and try again.',
  onRetry,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

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

  const onPressIn = () =>
    Animated.spring(btnScale, { toValue: 0.95, friction: 8, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  return (
    <Animated.View
      style={[s.container, { opacity, transform: [{ translateY }] }]}
    >
      <View style={s.card}>
        {/* Decorative accent line */}
        <View style={s.accentLine} />

        {/* Warning icon */}
        <View style={s.iconWrap}>
          <View style={s.iconOuter}>
            <Text style={s.iconText}>!</Text>
          </View>
        </View>

        <Text style={s.title}>Upload unavailable</Text>
        <Text style={s.body}>{message}</Text>

        {onRetry && (
          <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onRetry}>
            <Animated.View style={[s.retryBtn, { transform: [{ scale: btnScale }] }]}>
              <Text style={s.retryText}>Try Again</Text>
            </Animated.View>
          </Pressable>
        )}
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
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#0A0A0A',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    overflow: 'hidden',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: C.accent,
  },
  iconWrap: {
    marginBottom: 24,
  },
  iconOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(99,91,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
    fontWeight: '900',
    color: C.accent,
  },
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
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginBottom: 28,
  },
  retryBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: -0.2,
  },
});

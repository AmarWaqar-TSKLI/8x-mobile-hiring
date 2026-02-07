/**
 * UploadFAB — floating action button with animated ring pulse
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { C } from './constants';

interface Props {
  onPress: () => void;
}

export function UploadFAB({ onPress }: Props) {
  /* entrance */
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1, delay: 400,
      friction: 6, tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  /* pulse ring */
  const ring = useRef(new Animated.Value(1)).current;
  const ringOp = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(ring, {
          toValue: 1.45, duration: 1800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(ringOp, {
          toValue: 0, duration: 1800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  /* press */
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={[s.wrap, { transform: [{ scale: entrance }] }]}>
      {/* Pulse ring */}
      <Animated.View
        style={[
          s.ring,
          { opacity: ringOp, transform: [{ scale: ring }] },
        ]}
      />

      <Pressable
        onPressIn={() => Animated.spring(scale, { toValue: 0.88, friction: 8, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
        onPress={onPress}
      >
        <Animated.View style={[s.btn, { transform: [{ scale }] }]}>
          <View style={s.plus}>
            <View style={s.plusH} />
            <View style={s.plusV} />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ring: {
    position: 'absolute',
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: C.accent,
  },

  btn: {
    width: 60, height: 60, borderRadius: 20,
    backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '0px 8px 24px rgba(99, 91, 255, 0.4)',
    elevation: 8,
  },
  plus: {
    width: 24, height: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  plusH: {
    width: 18, height: 3, borderRadius: 1.5,
    backgroundColor: '#FFF', position: 'absolute',
  },
  plusV: {
    width: 3, height: 18, borderRadius: 1.5,
    backgroundColor: '#FFF', position: 'absolute',
  },
});

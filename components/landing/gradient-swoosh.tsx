import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import { C } from './constants';
import { useFloat } from './hooks';

export function GradientSwoosh({ scrollY }: { scrollY: Animated.Value }) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const ribbons = [
    { color: C.violet,  width: 70, left: screenW - 90,  delay: 0,    swayRange: 12 },
    { color: C.pink,    width: 60, left: screenW - 60,  delay: 300,  swayRange: 16 },
    { color: C.orange,  width: 55, left: screenW - 30,  delay: 600,  swayRange: 10 },
    { color: C.peach,   width: 65, left: screenW - 10,  delay: 200,  swayRange: 14 },
    { color: C.lavender,width: 50, left: screenW - 120, delay: 400,  swayRange: 18 },
  ];

  const parallax = scrollY.interpolate({
    inputRange: [0, 600],
    outputRange: [0, -140],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[s.container, { width: screenW * 0.55, height: screenH + 100, transform: [{ translateY: parallax }], pointerEvents: 'none' }]}>
      {ribbons.map((r, i) => (
        <SwooshRibbon key={i} {...r} index={i} screenH={screenH} />
      ))}
    </Animated.View>
  );
}

function SwooshRibbon({ color, width, left, delay, swayRange, index, screenH }: {
  color: string; width: number; left: number; delay: number; swayRange: number; index: number; screenH: number;
}) {
  const sway = useFloat(swayRange, 4000 + delay);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 1200, delay: 200 + delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideIn, { toValue: 0, duration: 1400, delay: 200 + delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left,
        top: -100,
        width,
        height: screenH + 200,
        backgroundColor: color,
        opacity: fadeIn,
        borderRadius: width / 2,
        transform: [
          { translateX: sway },
          { translateY: slideIn },
          { rotate: `${-15 + index * 3}deg` },
          { scaleY: 1.3 },
        ],
      }}
    />
  );
}

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -60,
    right: 0,
    overflow: 'hidden',
    opacity: 0.55,
  },
});

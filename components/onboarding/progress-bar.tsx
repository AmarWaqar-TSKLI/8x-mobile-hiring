import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { C, TOTAL_STEPS } from './constants';

interface Props {
  current: number;
}

export function ProgressBar({ current }: Props) {
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: (current + 1) / TOTAL_STEPS,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [current]);

  return (
    <View style={s.track}>
      <Animated.View
        style={[
          s.fill,
          {
            width: animWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
      {/* Step dots */}
      <View style={s.dotsRow}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <View
            key={i}
            style={[
              s.dot,
              i <= current ? s.dotActive : s.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    marginHorizontal: 28,
    marginBottom: 8,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: C.accent,
  },
  dotInactive: {
    backgroundColor: C.border,
  },
});

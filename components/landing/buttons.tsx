import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { C } from './constants';

export function PrimaryButton({ label, onPress }: { label: string; onPress?: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scale, { toValue: 0.94, friction: 8, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  return (
    <Pressable onPressIn={onIn} onPressOut={onOut} onPress={onPress}>
      <Animated.View style={[s.btnPrimary, { transform: [{ scale }] }]}>
        <Text style={s.btnPrimaryText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress?: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scale, { toValue: 0.94, friction: 8, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  return (
    <Pressable onPressIn={onIn} onPressOut={onOut} onPress={onPress}>
      <Animated.View style={[s.btnGhost, { transform: [{ scale }] }]}>
        <Text style={s.btnGhostText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btnPrimary: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.accent, paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12 },
  btnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },
  btnGhost: { paddingHorizontal: 20, paddingVertical: 16, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surface },
  btnGhostText: { fontSize: 16, fontWeight: '600', color: C.inkSoft, letterSpacing: -0.3 },
});

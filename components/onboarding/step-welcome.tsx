/**
 * Step 1 — Welcome / Name input
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { C } from './constants';
import { useEntrance } from './hooks';

interface Props {
  onNext: (name: string) => void;
}

export function StepWelcome({ onNext }: Props) {
  const { width: screenW } = useWindowDimensions();
  const [name, setName]       = useState('');
  const [focused, setFocused] = useState(false);

  const h = useEntrance(0);
  const f = useEntrance(200);

  // Animated wave hand
  const wave = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(wave, { toValue: 1, duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wave, { toValue: -1, duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wave, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.delay(2000),
      ]),
    ).start();
  }, []);

  const waveRotate = wave.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  const btnScale = useRef(new Animated.Value(1)).current;

  return (
    <View style={s.container}>
      <Animated.View style={[s.brandWrap, { transform: [{ rotate: waveRotate }] }]}>
        <Text style={s.brandMark}>8x</Text>
      </Animated.View>

      <Animated.View style={{ opacity: h.opacity, transform: [{ translateY: h.translateY }] }}>
        <Text style={s.title}>Welcome to 8x</Text>
        <Text style={[s.subtitle, { maxWidth: screenW * 0.85 }]}>
          Let's set up your creator profile. First, what should we call you?
        </Text>
      </Animated.View>

      <Animated.View style={[s.formArea, { opacity: f.opacity, transform: [{ translateY: f.translateY }] }]}>
        <View style={s.inputGroup}>
          <Text style={s.label}>Your name</Text>
          <TextInput
            style={[s.input, focused && s.inputFocused]}
            placeholder="e.g. Sarah Mitchell"
            placeholderTextColor={C.subtle}
            autoCapitalize="words"
            autoFocus
            value={name}
            onChangeText={setName}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            returnKeyType="next"
            onSubmitEditing={() => name.trim() && onNext(name.trim())}
          />
        </View>

        {name.trim().length > 0 && (
          <View style={s.previewCard}>
            <View style={s.previewAvatar}>
              <Text style={s.previewInitial}>{name.trim()[0]?.toUpperCase()}</Text>
            </View>
            <View>
              <Text style={s.previewName}>{name.trim()}</Text>
              <Text style={s.previewRole}>Creator on 8x</Text>
            </View>
          </View>
        )}

        <Pressable
          onPressIn={() => Animated.spring(btnScale, { toValue: 0.95, friction: 8, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
          onPress={() => name.trim() && onNext(name.trim())}
        >
          <Animated.View style={[s.btn, !name.trim() && s.btnDisabled, { transform: [{ scale: btnScale }] }]}>
            <Text style={s.btnText}>Continue</Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },

  brandWrap: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center',
    boxShadow: '0px 8px 20px rgba(99, 91, 255, 0.3)',
    elevation: 4,
    alignSelf: 'center', marginBottom: 24,
  },
  brandMark: { fontSize: 28, fontWeight: '800', color: '#FFF', letterSpacing: -2 },

  title: {
    fontSize: 28, fontWeight: '800', color: C.ink,
    letterSpacing: -1.5, textAlign: 'center', marginBottom: 10,
  },
  subtitle: {
    fontSize: 16, lineHeight: 24, color: C.muted,
    textAlign: 'center', marginBottom: 40,
    alignSelf: 'center',
  },

  formArea: { gap: 24 },

  inputGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: C.inkSoft, letterSpacing: 0.3 },
  input: {
    backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 14, paddingHorizontal: 22, paddingVertical: 16,
    fontSize: 16, color: C.ink,
  },
  inputFocused: {
    borderColor: C.accent,
  },

  previewCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.surface, borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: C.border,
  },
  previewAvatar: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center',
  },
  previewInitial: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  previewName: { fontSize: 16, fontWeight: '700', color: C.ink, letterSpacing: -0.3 },
  previewRole: { fontSize: 13, color: C.muted, marginTop: 2 },

  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.accent, paddingVertical: 18, borderRadius: 14,
    boxShadow: '0px 8px 16px rgba(99, 91, 255, 0.25)',
    elevation: 4,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontSize: 17, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },
});

/**
 * Step 3 — Niche selection + social connections
 */
import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { C, NICHES } from './constants';
import { useEntrance } from './hooks';

interface Props {
  onNext: () => void;
}

export function StepNiche({ onNext }: Props) {
  const { width: screenW } = useWindowDimensions();
  const [selected, setSelected] = useState<string[]>([]);
  const [ig, setIg]             = useState('');
  const [tt, setTt]             = useState('');
  const [focusedField, setFocusedField] = useState<'ig' | 'tt' | null>(null);

  const h = useEntrance(0);
  const f = useEntrance(200);
  const s2 = useEntrance(400);

  const toggle = (label: string) => {
    setSelected(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label],
    );
  };

  const btnScale = useRef(new Animated.Value(1)).current;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: h.opacity, transform: [{ translateY: h.translateY }] }}>
        <Text style={s.title}>Your niche</Text>
        <Text style={[s.subtitle, { maxWidth: screenW * 0.85 }]}>
          Select your content categories and connect your socials so brands can find you.
        </Text>
      </Animated.View>

      {/* Niche chips */}
      <Animated.View style={[s.chipGrid, { opacity: f.opacity, transform: [{ translateY: f.translateY }] }]}>
        {NICHES.map(n => {
          const active = selected.includes(n.label);
          return (
            <Pressable key={n.label} onPress={() => toggle(n.label)}>
              <View style={[s.chip, active && s.chipActive]}>
                <Text style={s.chipIcon}>{n.icon}</Text>
                <Text style={[s.chipLabel, active && s.chipLabelActive]}>
                  {n.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Social connections */}
      <Animated.View style={[s.socialSection, { opacity: s2.opacity, transform: [{ translateY: s2.translateY }] }]}>
        <Text style={s.socialTitle}>Connect your socials</Text>
        <Text style={s.socialSub}>Optional — helps brands discover you faster</Text>

        <View style={s.socialInputGroup}>
          <View style={s.socialRow}>
            <View style={s.socialIcon}>
              <Text style={s.socialLabel}>IG</Text>
            </View>
            <TextInput
              style={[s.socialInput, focusedField === 'ig' && s.inputFocused]}
              placeholder="Instagram username"
              placeholderTextColor={C.subtle}
              autoCapitalize="none"
              autoCorrect={false}
              value={ig}
              onChangeText={setIg}
              onFocus={() => setFocusedField('ig')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={s.socialRow}>
            <View style={[s.socialIcon, { backgroundColor: '#E8FBF5' }]}>
              <Text style={[s.socialLabel, { color: '#00D4AA' }]}>TT</Text>
            </View>
            <TextInput
              style={[s.socialInput, focusedField === 'tt' && s.inputFocused]}
              placeholder="TikTok username"
              placeholderTextColor={C.subtle}
              autoCapitalize="none"
              autoCorrect={false}
              value={tt}
              onChangeText={setTt}
              onFocus={() => setFocusedField('tt')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>
      </Animated.View>

      {/* Continue button */}
      <View style={s.bottomArea}>
        <Pressable
          onPressIn={() => Animated.spring(btnScale, { toValue: 0.95, friction: 8, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
          onPress={onNext}
        >
          <Animated.View style={[s.btn, selected.length === 0 && s.btnDisabled, { transform: [{ scale: btnScale }] }]}>
            <Text style={s.btnText}>Continue</Text>
          </Animated.View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 28, paddingTop: 24, paddingBottom: 24 },

  title: {
    fontSize: 28, fontWeight: '800', color: C.ink,
    letterSpacing: -1.5, textAlign: 'center', marginBottom: 10,
  },
  subtitle: {
    fontSize: 16, lineHeight: 24, color: C.muted,
    textAlign: 'center', marginBottom: 24,
    alignSelf: 'center',
  },

  chipGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    justifyContent: 'center',
    maxHeight: 260,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 50, borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.surface,
  },
  chipActive: {
    borderColor: C.accent, backgroundColor: C.accentBg,
  },
  chipIcon: { fontSize: 14 },
  chipLabel: { fontSize: 14, fontWeight: '600', color: C.inkSoft },
  chipLabelActive: { color: C.accent },

  socialSection: { marginTop: 28 },
  socialTitle: { fontSize: 18, fontWeight: '700', color: C.ink, letterSpacing: -0.5, marginBottom: 6 },
  socialSub: { fontSize: 14, color: C.muted, marginBottom: 18 },

  socialInputGroup: { gap: 12 },
  socialRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  socialIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: C.accentBg, alignItems: 'center', justifyContent: 'center',
  },
  socialLabel: { fontSize: 14, fontWeight: '800', color: C.accent, letterSpacing: -0.5 },
  socialInput: {
    flex: 1, backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 14, paddingHorizontal: 22, paddingVertical: 16,
    fontSize: 16, color: C.ink,
  },
  inputFocused: {
    borderColor: C.accent,
  },

  bottomArea: { marginTop: 28 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.accent, paddingVertical: 18, borderRadius: 14,
    boxShadow: '0px 8px 16px rgba(99, 91, 255, 0.25)',
    elevation: 4,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontSize: 17, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },
});

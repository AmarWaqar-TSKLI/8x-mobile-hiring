/**
 * Get Started (Sign Up) Screen — Premium onboarding
 *
 * Dark branded header, password strength bar, social proof,
 * "Already have an account? Sign in" link.
 * No real auth — just UI and navigation.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const C = {
  bg:       '#FAFAFA',
  surface:  '#FFFFFF',
  ink:      '#0A2540',
  inkSoft:  '#425466',
  muted:    '#6B7C93',
  subtle:   '#C1C9D2',
  border:   '#E6EBF1',
  accent:   '#635BFF',
  accentBg: '#F0EEFF',
  accentAlt:'#00D4AA',
  danger:   '#FF4757',
};

function useEntrance(delay = 0) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(36)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 800, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 10, tension: 40, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return { opacity, translateY };
}

/* ── password strength ──── */
function getPasswordStrength(pw: string) {
  if (!pw) return { label: '', color: 'transparent', width: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', color: C.danger, width: 0.25 };
  if (score <= 3) return { label: 'Medium', color: '#FF9F43', width: 0.55 };
  return { label: 'Strong', color: C.accentAlt, width: 1 };
}

export default function GetStartedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused]   = useState<'name' | 'email' | 'password' | null>(null);
  const [agreed, setAgreed]     = useState(false);

  const header  = useEntrance(0);
  const form    = useEntrance(200);
  const footer  = useEntrance(400);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const btnScale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(btnScale, { toValue: 0.95, friction: 8, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  // Brand accent line animation
  const lineWidth = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(lineWidth, {
      toValue: 1, duration: 1000, delay: 300,
      easing: Easing.out(Easing.cubic), useNativeDriver: false,
    }).start();
  }, []);

  const handleCreate = () => {
    router.replace('/sign-in');
  };

  return (
    <KeyboardAvoidingView
      style={[s.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>Go Back</Text>
        </Pressable>

        {/* Branded header */}
        <Animated.View style={[s.headerBlock, { opacity: header.opacity, transform: [{ translateY: header.translateY }] }]}>
          <Text style={s.logoMark}>8x</Text>
          <Animated.View
            style={[
              s.accentLine,
              { width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '36%'] }) },
            ]}
          />
          <Text style={s.title}>Create your account</Text>
          <Text style={s.subtitle}>
            Join 12,000+ creators already earning on 8x
          </Text>

          {/* Social proof avatars */}
          <View style={s.proofRow}>
            <View style={s.avatarStack}>
              {['#635BFF', '#00D4AA', '#FF7A00', '#FF3CAC'].map((c, i) => (
                <View key={i} style={[s.proofAvatar, { backgroundColor: c, marginLeft: i ? -8 : 0, zIndex: 4 - i }]}>
                  <Text style={s.proofInitial}>{['S', 'A', 'K', 'J'][i]}</Text>
                </View>
              ))}
            </View>
            <Text style={s.proofText}>
              <Text style={{ fontWeight: '700', color: C.ink }}>4.9★</Text> avg. creator rating
            </Text>
          </View>
        </Animated.View>

        {/* Form card */}
        <Animated.View style={[s.formCard, { opacity: form.opacity, transform: [{ translateY: form.translateY }] }]}>
          <View style={s.inputGroup}>
            <Text style={s.label}>Full name</Text>
            <TextInput
              style={[s.input, focused === 'name' && s.inputFocused]}
              placeholder="Jane Doe"
              placeholderTextColor={C.subtle}
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={[s.input, focused === 'email' && s.inputFocused]}
              placeholder="you@example.com"
              placeholderTextColor={C.subtle}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Password</Text>
            <TextInput
              style={[s.input, focused === 'password' && s.inputFocused]}
              placeholder="Min 8 characters"
              placeholderTextColor={C.subtle}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
            />
            {password.length > 0 && (
              <View style={s.strengthRow}>
                <View style={s.strengthTrack}>
                  <View style={[s.strengthFill, { width: `${strength.width * 100}%`, backgroundColor: strength.color }]} />
                </View>
                <Text style={[s.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              </View>
            )}
          </View>

          {/* Terms checkbox */}
          <Pressable style={s.checkRow} onPress={() => setAgreed(!agreed)}>
            <View style={[s.checkbox, agreed && s.checkboxChecked]}>
              {agreed && <Text style={s.checkmark}>✓</Text>}
            </View>
            <Text style={s.checkLabel}>
              I agree to the <Text style={s.checkLink}>Terms of Service</Text> and{' '}
              <Text style={s.checkLink}>Privacy Policy</Text>
            </Text>
          </Pressable>

          {/* Create Account button */}
          <Pressable onPressIn={onIn} onPressOut={onOut} onPress={handleCreate}>
            <Animated.View style={[s.createBtn, { transform: [{ scale: btnScale }] }]}>
              <Text style={s.createBtnText}>Create Account</Text>
            </Animated.View>
          </Pressable>

          {/* Divider */}
          <View style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Social */}
          <Pressable style={s.socialBtn}>
            <View style={s.socialBtnInner}>
              <View style={s.gCircle}><Text style={s.gLetter}>G</Text></View>
              <Text style={s.socialBtnText}>Continue with Google</Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* Footer */}
        <Animated.View style={[s.footerWrap, { opacity: footer.opacity, transform: [{ translateY: footer.translateY }] }]}>
          <Text style={s.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/sign-in')}>
            <Text style={s.footerLink}> Sign in</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },

  backBtn: { marginTop: 16, marginBottom: 4, alignSelf: 'flex-start' },
  backText: { fontSize: 15, fontWeight: '600', color: C.muted },

  /* ── branded header ─── */
  headerBlock: { marginTop: 12, marginBottom: 28 },
  logoMark: { fontSize: 42, fontWeight: '800', color: C.ink, letterSpacing: -3 },
  accentLine: {
    height: 4, backgroundColor: C.accent, borderRadius: 2,
    marginTop: 10, marginBottom: 20,
  },
  title: { fontSize: 30, fontWeight: '800', color: C.ink, letterSpacing: -1.5, lineHeight: 36 },
  subtitle: { fontSize: 15, color: C.muted, marginTop: 10, lineHeight: 22 },

  proofRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20,
  },
  avatarStack: { flexDirection: 'row' },
  proofAvatar: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: C.bg,
  },
  proofInitial: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  proofText: { fontSize: 13, color: C.muted },

  /* ── form card ─── */
  formCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 24,
    gap: 20,
    borderWidth: 1,
    borderColor: C.border,
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  inputGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: C.inkSoft, letterSpacing: 0.3 },
  input: {
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: C.ink,
  },
  inputFocused: { borderColor: C.accent },

  /* ── password strength ─── */
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  strengthTrack: {
    flex: 1, height: 4, borderRadius: 2, backgroundColor: C.border, overflow: 'hidden',
  },
  strengthFill: { height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '600', minWidth: 50 },

  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 4 },
  checkbox: {
    width: 24, height: 24, borderRadius: 8,
    borderWidth: 2, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.bg,
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: C.accent, borderColor: C.accent },
  checkmark: { fontSize: 14, fontWeight: '700', color: '#FFF', marginTop: -1 },
  checkLabel: { flex: 1, fontSize: 14, lineHeight: 20, color: C.muted },
  checkLink: { color: C.accent, fontWeight: '600' },

  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.accent,
    paddingVertical: 18,
    borderRadius: 14,
    marginTop: 4,
    boxShadow: '0px 8px 20px rgba(99, 91, 255, 0.3)',
    elevation: 4,
  },
  createBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 13, color: C.subtle, fontWeight: '500' },

  socialBtn: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingVertical: 15,
    backgroundColor: C.bg,
  },
  socialBtnInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  gCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  gLetter: { fontSize: 14, fontWeight: '700', color: C.ink },
  socialBtnText: { fontSize: 16, fontWeight: '600', color: C.inkSoft },

  footerWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 28, paddingBottom: 20 },
  footerText: { fontSize: 15, color: C.muted },
  footerLink: { fontSize: 15, fontWeight: '700', color: C.accent },
});

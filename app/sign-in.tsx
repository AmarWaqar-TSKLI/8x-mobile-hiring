/**
 * Sign In Screen — Premium, minimal auth UI
 *
 * Email + password fields, Sign In button, link to Sign Up.
 * Branded header with accent line, form card, social proof.
 * No real auth — just UI and navigation.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const C = {
  bg:      '#FAFAFA',
  surface: '#FFFFFF',
  ink:     '#0A2540',
  inkSoft: '#425466',
  muted:   '#6B7C93',
  subtle:  '#C1C9D2',
  border:  '#E6EBF1',
  accent:  '#635BFF',
  accentBg:'#F0EEFF',
  danger:  '#FF4757',
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

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused]   = useState<'email' | 'password' | null>(null);

  const header = useEntrance(0);
  const form   = useEntrance(200);
  const footer = useEntrance(400);

  const btnScale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(btnScale, { toValue: 0.95, friction: 8, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  // Brand accent line animation
  const lineWidth = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(lineWidth, {
      toValue: 1, duration: 1200, delay: 300,
      easing: Easing.out(Easing.cubic), useNativeDriver: false,
    }).start();
  }, []);

  const handleSignIn = () => {
    router.replace('/onboarding');
  };

  return (
    <KeyboardAvoidingView
      style={[s.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.container}>
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
              { width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '40%'] }) },
            ]}
          />
          <Text style={s.title}>Welcome back</Text>
          <Text style={s.subtitle}>Sign in to your creator account</Text>
        </Animated.View>

        {/* Form card */}
        <Animated.View style={[s.formCard, { opacity: form.opacity, transform: [{ translateY: form.translateY }] }]}>
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
              placeholder="••••••••"
              placeholderTextColor={C.subtle}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
            />
            <Pressable style={s.forgotWrap}>
              <Text style={s.forgot}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* Sign In Button */}
          <Pressable onPressIn={onIn} onPressOut={onOut} onPress={handleSignIn}>
            <Animated.View style={[s.signInBtn, { transform: [{ scale: btnScale }] }]}>
              <Text style={s.signInBtnText}>Sign In</Text>
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

        {/* Footer link */}
        <Animated.View style={[s.footerWrap, { opacity: footer.opacity, transform: [{ translateY: footer.translateY }] }]}>
          <Text style={s.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.push('/get-started')}>
            <Text style={s.footerLink}> Sign up</Text>
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, paddingHorizontal: 24 },

  backBtn: { marginTop: 16, marginBottom: 4, alignSelf: 'flex-start' },
  backText: { fontSize: 15, fontWeight: '600', color: C.muted },

  /* ── branded header ─── */
  headerBlock: { marginTop: 24, marginBottom: 32 },
  logoMark: { fontSize: 42, fontWeight: '800', color: C.ink, letterSpacing: -3 },
  accentLine: {
    height: 4, backgroundColor: C.accent, borderRadius: 2,
    marginTop: 12, marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '800', color: C.ink, letterSpacing: -1.5 },
  subtitle: { fontSize: 15, color: C.muted, marginTop: 8, lineHeight: 22 },

  /* ── form card ─── */
  formCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 24,
    gap: 22,
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
  forgotWrap: { alignSelf: 'flex-end', marginTop: 2 },
  forgot: { fontSize: 13, fontWeight: '600', color: C.accent },

  signInBtn: {
    backgroundColor: C.accent,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
    boxShadow: '0px 8px 20px rgba(99, 91, 255, 0.3)',
    elevation: 4,
  },
  signInBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },

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

  footerWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingBottom: 40 },
  footerText: { fontSize: 15, color: C.muted },
  footerLink: { fontSize: 15, fontWeight: '700', color: C.accent },
});

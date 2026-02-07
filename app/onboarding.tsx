/**
 * Onboarding Flow — 5-step creator onboarding
 *
 * 0: Phone verification (OTP)
 * 1: Welcome / Name
 * 2: Profile photo
 * 3: Niche + socials
 * 4: All set — success
 *
 * Smooth animated transitions between steps, progress bar at top.
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  C,
  TOTAL_STEPS,
  ProgressBar,
  StepPhone,
  StepWelcome,
  StepProfile,
  StepNiche,
  StepSuccess,
} from '@/components/onboarding';

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep]   = useState(0);
  const [name, setName]   = useState('');

  // Transition animation values
  const fadeAnim      = useRef(new Animated.Value(1)).current;
  const slideAnim     = useRef(new Animated.Value(0)).current;

  const animateTransition = useCallback((nextStep: number, reverse = false) => {
    const outDir = reverse ? 60 : -60;
    const inDir  = reverse ? -60 : 60;
    // Slide out + fade
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0, duration: 200,
        easing: Easing.in(Easing.cubic), useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: outDir, duration: 250,
        easing: Easing.in(Easing.cubic), useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(nextStep);
      // Reset position
      slideAnim.setValue(inDir);
      // Slide in + fade
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 300,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0, friction: 12, tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  const exitOnboarding = useCallback(() => {
    router.back();
  }, [router]);

  const handleFinish = () => {
    router.replace('/(app)/feed');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepPhone onNext={() => animateTransition(1)} />;
      case 1:
        return (
          <StepWelcome
            onNext={(n) => {
              setName(n);
              animateTransition(2);
            }}
          />
        );
      case 2:
        return <StepProfile name={name} onNext={() => animateTransition(3)} />;
      case 3:
        return <StepNiche onNext={() => animateTransition(4)} />;
      case 4:
        return <StepSuccess name={name} onFinish={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[s.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Fixed header + progress (never slides) ─────── */}
      <View style={s.fixedTop}>
        <View style={s.header}>
          {step > 0 && step < TOTAL_STEPS - 1 ? (
            <Pressable onPress={() => animateTransition(step - 1, true)} style={s.backBtn} hitSlop={12}>
              <Text style={s.backText}>Back</Text>
            </Pressable>
          ) : step === 0 ? (
            <Pressable onPress={exitOnboarding} style={s.backBtn} hitSlop={12}>
              <Text style={s.backText}>Exit</Text>
            </Pressable>
          ) : (
            <View style={s.backBtn} />
          )}

          <View style={s.stepLabel}>
            <Text style={s.stepText}>
              {step < TOTAL_STEPS - 1 ? `${step + 1} of ${TOTAL_STEPS - 1}` : ''}
            </Text>
          </View>

          {step === 0 ? (
            <Pressable onPress={() => animateTransition(1)} style={s.skipBtn} hitSlop={12}>
              <Text style={s.skipText}>Skip</Text>
            </Pressable>
          ) : (
            <View style={s.skipBtn} />
          )}
        </View>

        <ProgressBar current={step} />
      </View>

      {/* ── Step content with slide transitions ────────── */}
      <Animated.View
        style={[
          s.content,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {renderStep()}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  /* Fixed header area — sits on top, never animates */
  fixedTop: {
    zIndex: 10,
    backgroundColor: C.bg,
  },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: { width: 85 },
  backText: { fontSize: 15, fontWeight: '600', color: C.muted },
  stepLabel: { flex: 1, alignItems: 'center' },
  stepText: { fontSize: 13, fontWeight: '600', color: C.subtle },
  skipBtn: { width: 70, alignItems: 'flex-end' },
  skipText: { fontSize: 15, fontWeight: '600', color: C.accent },

  content: { flex: 1, paddingTop: 24 },
});

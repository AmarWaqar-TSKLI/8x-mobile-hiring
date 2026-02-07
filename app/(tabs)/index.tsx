import React, { useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  C,
  Navbar,
  HeroSection,
  SocialProof,
  BenefitsSection,
  FeaturesSection,
  HowItWorksSection,
  BottomCTA,
  TestimonialsSection,
  Footer,
} from '@/components/landing';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const goGetStarted = () => router.push('/get-started');
  const goSignIn = () => router.push('/sign-in');

  return (
    <View style={s.root}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.heroContainer}>
          <HeroSection scrollY={scrollY} onGetStarted={goGetStarted} />
        </View>

        <View style={s.lightSections}>
          <SocialProof />
          <BenefitsSection scrollY={scrollY} />
          <HowItWorksSection scrollY={scrollY} />
          <TestimonialsSection scrollY={scrollY} />
          <FeaturesSection scrollY={scrollY} />
          <BottomCTA onGetStarted={goGetStarted} />
          <Footer />
        </View>
      </Animated.ScrollView>

      <Navbar
        scrollY={scrollY}
        insetTop={insets.top}
        onSignIn={goSignIn}
        onGetStarted={goGetStarted}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  heroContainer: { backgroundColor: '#000' },
  lightSections: { backgroundColor: C.bg },
});

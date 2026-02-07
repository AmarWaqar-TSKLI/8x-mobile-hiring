/**
 * Profile Screen — full creator profile with analytics, portfolio,
 * achievements, earnings, brand partnerships, and settings.
 *
 * Features:
 * - Skeleton loading → staggered content reveal
 * - Pull-to-refresh with shimmer reload
 * - ProfileHeader (avatar, stats, bio, actions)
 * - ProfileStats (analytics cards with sparklines)
 * - PortfolioGrid (3-col pinnable content grid)
 * - AchievementRow (tier-coloured milestone badges)
 * - EarningsCard (monthly dashboard with goal progress)
 * - BrandConnections (partner list with status)
 * - SettingsSection (toggles, navigation items)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  C,
  ProfileHeader,
  ErrorProfile,
  ProfileStats,
  PortfolioGrid,
  AchievementRow,
  EarningsCard,
  BrandConnections,
} from '@/components/profile';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(false);
  const contentO = useRef(new Animated.Value(0)).current;

  /* initial load simulation */
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      Animated.timing(contentO, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }).start();
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  /* pull-to-refresh */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setError(false);
    contentO.setValue(0);
    setTimeout(() => {
      setRefreshing(false);
      Animated.timing(contentO, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }).start();
    }, 900);
  }, []);

  /* retry after error */
  const onRetry = useCallback(() => {
    setError(false);
    setLoading(true);
    contentO.setValue(0);
    setTimeout(() => {
      setLoading(false);
      Animated.timing(contentO, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }).start();
    }, 1200);
  }, []);

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.accent}
            colors={[C.accent]}
          />
        }
      >
        {error ? (
          <ErrorProfile onRetry={onRetry} />
        ) : loading ? (
          <ProfileSkeleton />
        ) : (
          <Animated.View style={{ opacity: contentO }}>
            <ProfileHeader onSettingsPress={() => router.push('/(app)/settings')} />
            <ProfileStats />
            <PortfolioGrid />
            <AchievementRow />
            <EarningsCard />
            <BrandConnections />
          </Animated.View>
        )}
      </ScrollView>


    </View>
  );
}

/* ── Skeleton loader ──────────────────────────────────────────────────── */
function ProfileSkeleton() {
  return (
    <View style={s.skeletonWrap}>
      {/* avatar + name */}
      <View style={s.skAvatarRow}>
        <SkeletonBox w={86} h={86} r={43} delay={0} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonBox w="65%" h={18} r={8} delay={60} />
          <SkeletonBox w="40%" h={13} r={6} delay={100} />
          <SkeletonBox w="30%" h={11} r={5} delay={140} />
        </View>
      </View>
      {/* stat row */}
      <SkeletonBox w="100%" h={70} r={16} delay={180} />
      {/* bio */}
      <SkeletonBox w="100%" h={60} r={12} delay={220} />
      {/* buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <SkeletonBox w="42%" h={44} r={12} delay={260} />
        <SkeletonBox w="42%" h={44} r={12} delay={300} />
        <SkeletonBox w={44} h={44} r={12} delay={340} />
      </View>
      {/* analytics */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
        {[0,1,2,3].map(i => (
          <SkeletonBox key={i} w={130} h={120} r={18} delay={380 + i * 50} />
        ))}
      </View>
      {/* portfolio grid */}
      <View style={{ flexDirection: 'row', gap: 3, marginTop: 14 }}>
        {[0,1,2].map(i => (
          <SkeletonBox key={i} w="32%" h={140} r={10} delay={580 + i * 50} />
        ))}
      </View>
    </View>
  );
}

function SkeletonBox({ w, h, r = 8, delay = 0, style }: {
  w: number | string; h: number; r?: number; delay?: number; style?: object;
}) {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 0.7, duration: 800,
            easing: Easing.inOut(Easing.ease), useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0.35, duration: 800,
            easing: Easing.inOut(Easing.ease), useNativeDriver: true,
          }),
        ]),
      ).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View
      style={[
        { width: w as any, height: h, borderRadius: r, backgroundColor: '#E2E8F0', opacity: pulse },
        style,
      ]}
    />
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 120 },

  /* skeleton */
  skeletonWrap: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  skAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },


});

/**
 * Feed Screen — scrollable campaign cards with loading / empty / error states
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  C,
  CAMPAIGNS,
  CampaignCard,
  FeedHeader,
  SkeletonList,
  EmptyState,
  ErrorState,
} from '@/components/feed';
import type { Campaign } from '@/components/feed';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [campaigns, setCampaigns]   = useState<Campaign[]>([]);
  const [error, setError]           = useState(false);

  /* fade in when data arrives */
  const listOpacity = useRef(new Animated.Value(0)).current;

  /* simulate initial load */
  useEffect(() => {
    const t = setTimeout(() => {
      setCampaigns(CAMPAIGNS);
      setLoading(false);
      Animated.timing(listOpacity, {
        toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web',
      }).start();
    }, 1600);
    return () => clearTimeout(t);
  }, []);

  /* pull-to-refresh — replay skeleton → content transition */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setError(false);
    setLoading(true);          // show skeleton again
    setCampaigns([]);
    listOpacity.setValue(0);
    setTimeout(() => {
      setCampaigns(CAMPAIGNS);
      setLoading(false);
      setRefreshing(false);
      Animated.timing(listOpacity, {
        toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web',
      }).start();
    }, 1400);
  }, []);

  /* retry after error */
  const onRetry = useCallback(() => {
    setError(false);
    setLoading(true);
    listOpacity.setValue(0);
    setTimeout(() => {
      setCampaigns(CAMPAIGNS);
      setLoading(false);
      Animated.timing(listOpacity, {
        toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web',
      }).start();
    }, 1600);
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
        <FeedHeader userName="Jane" />

        {error ? (
          <ErrorState onRetry={onRetry} />
        ) : loading ? (
          <SkeletonList />
        ) : campaigns.length === 0 ? (
          <EmptyState />
        ) : (
          <Animated.View style={[s.list, { opacity: listOpacity }]}>
            {campaigns.map((c, i) => (
              <CampaignCard key={c.id} campaign={c} index={i} />
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

/* ── main styles ──────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 100 },   // extra space for tab bar
  list: { paddingHorizontal: 20, paddingTop: 12 },
});

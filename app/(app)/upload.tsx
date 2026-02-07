/**
 * Upload Screen — full content management with video grid,
 * drafts, stats, empty state, and bottom-sheet upload modal.
 *
 * Features:
 * - Skeleton → content transition
 * - Segmented tabs: All / Published / Drafts / In Review
 * - Stats bar with quick metrics
 * - Draft horizontal scroll
 * - 2-column video thumbnail grid
 * - Floating action button with pulse ring
 * - Bottom sheet with real camera + library picker
 */
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  Animated,
  Easing,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  C,
  VIDEOS,
  DRAFTS,
  VideoCard,
  CARD_GAP,
  UploadHeader,
  StatsBar,
  DraftRow,
  EmptyUpload,
  ErrorUpload,
  UploadSheet,
} from '@/components/upload';
import type { VideoItem } from '@/components/upload';

type Tab = 'all' | 'published' | 'drafts' | 'review';

export default function UploadScreen() {
  const insets = useSafeAreaInsets();

  /* state */
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [videos, setVideos]       = useState<VideoItem[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  /* entrance fade */
  const listOpacity = useRef(new Animated.Value(0)).current;

  /* simulate initial load */
  useEffect(() => {
    const t = setTimeout(() => {
      setVideos(VIDEOS);
      setLoading(false);
      Animated.timing(listOpacity, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }).start();
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  /* refresh */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setError(false);
    listOpacity.setValue(0);
    setTimeout(() => {
      setVideos(VIDEOS);
      setRefreshing(false);
      Animated.timing(listOpacity, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }).start();
    }, 1000);
  }, []);

  /* retry after error */
  const onRetry = useCallback(() => {
    setError(false);
    setLoading(true);
    listOpacity.setValue(0);
    setTimeout(() => {
      setVideos(VIDEOS);
      setLoading(false);
      Animated.timing(listOpacity, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }).start();
    }, 1400);
  }, []);

  /* filter videos by tab */
  const filtered = useMemo(() => {
    switch (activeTab) {
      case 'published': return videos.filter(v => v.status === 'published');
      case 'drafts':    return [];  // drafts are a separate section
      case 'review':    return videos.filter(v => v.status === 'review' || v.status === 'processing');
      default:          return videos;
    }
  }, [videos, activeTab]);

  const showDrafts = activeTab === 'all' || activeTab === 'drafts';
  const showStats  = activeTab === 'all';
  const showGrid   = activeTab !== 'drafts';
  const isEmpty    = videos.length === 0 && !loading;

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      {error ? (
        <ErrorUpload onRetry={onRetry} />
      ) : isEmpty ? (
        <EmptyUpload onUpload={() => setSheetOpen(true)} />
      ) : (
        <>
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
            <UploadHeader activeTab={activeTab} onTabChange={setActiveTab} />

            {loading ? (
              <SkeletonGrid />
            ) : (
              <Animated.View style={{ opacity: listOpacity }}>
                {/* Stats */}
                {showStats && <StatsBar />}

                {/* Drafts */}
                {showDrafts && DRAFTS.length > 0 && (
                  <View style={s.section}>
                    <DraftRow drafts={DRAFTS} />
                  </View>
                )}

                {/* Video grid title */}
                {showGrid && (
                  <View style={s.gridHeader}>
                    <Text style={s.gridTitle}>
                      {activeTab === 'all' ? 'Your Videos' :
                       activeTab === 'published' ? 'Published' : 'Under Review'}
                    </Text>
                    <Text style={s.gridCount}>{filtered.length} videos</Text>
                  </View>
                )}

                {/* 2-col grid */}
                {showGrid && (
                  <View style={s.grid}>
                    {filtered.map((v, i) => (
                      <VideoCard key={v.id} video={v} index={i} />
                    ))}
                  </View>
                )}

                {/* Drafts-only list view */}
                {activeTab === 'drafts' && (
                  <DraftFullList />
                )}
              </Animated.View>
            )}
          </ScrollView>
        </>
      )}

      <UploadSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </View>
  );
}

/* ── Skeleton grid ────────────────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <View style={s.skeletonWrap}>
      {/* Stats skeleton */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.skStatRow}>
        {[0,1,2,3].map(i => (
          <SkeletonBox key={i} w={120} h={110} r={18} delay={i * 60} />
        ))}
      </ScrollView>
      {/* Grid skeleton */}
      <View style={s.grid}>
        {[0,1,2,3,4,5].map(i => (
          <View key={i} style={{ width: '47%' }}>
            <SkeletonBox w="100%" h={180} r={16} delay={200 + i * 80} />
            <SkeletonBox w="80%" h={12} r={6} delay={300 + i * 80} style={{ marginTop: 10 }} />
            <SkeletonBox w="50%" h={10} r={6} delay={350 + i * 80} style={{ marginTop: 6 }} />
          </View>
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
          Animated.timing(pulse, { toValue: 0.7, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0.35, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
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

/* ── Drafts full-page list (when "Drafts" tab active) ─────────────────── */
function DraftFullList() {
  if (DRAFTS.length === 0) {
    return (
      <View style={s.emptySection}>
        <Text style={s.emptyIcon}>📝</Text>
        <Text style={s.emptyTitle}>No drafts yet</Text>
        <Text style={s.emptySub}>Start recording and save as draft anytime.</Text>
      </View>
    );
  }

  return (
    <View style={s.draftFullWrap}>
      {DRAFTS.map((d, i) => (
        <View key={d.id} style={s.draftFullCard}>
          <View style={s.draftFullThumb}>
            <Animated.Image
              source={{ uri: d.thumbnail }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            <View style={s.draftFullOverlay}>
              <Text style={s.draftFullProgress}>{Math.round(d.progress * 100)}%</Text>
            </View>
            {/* progress bar */}
            <View style={s.draftFullTrack}>
              <View style={[s.draftFullFill, { width: `${d.progress * 100}%` as any }]} />
            </View>
          </View>
          <View style={s.draftFullInfo}>
            <Text style={s.draftFullTitle} numberOfLines={1}>{d.title}</Text>
            <Text style={s.draftFullMeta}>Last edited {d.lastEdited ? new Date(d.lastEdited).toLocaleDateString() : ''}</Text>
            <View style={s.draftFullActions}>
              <View style={s.editPill}><Text style={s.editPillText}>Continue editing</Text></View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingBottom: 120 },

  section: { marginTop: 16 },

  gridHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 20, marginBottom: 14,
  },
  gridTitle: {
    fontSize: 18, fontWeight: '800', color: C.ink,
    letterSpacing: -0.5,
  },
  gridCount: {
    fontSize: 13, fontWeight: '600', color: C.muted,
  },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: CARD_GAP,
  },

  /* skeleton */
  skeletonWrap: { paddingTop: 16 },
  skStatRow: { paddingHorizontal: 20, gap: 10, marginBottom: 24 },

  /* empty section */
  emptySection: {
    alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40,
  },
  emptyIcon: { fontSize: 40, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18, fontWeight: '800', color: C.ink,
    letterSpacing: -0.3, marginBottom: 6,
  },
  emptySub: {
    fontSize: 14, lineHeight: 20, color: C.muted, textAlign: 'center',
  },

  /* draft full list */
  draftFullWrap: {
    paddingHorizontal: 20, gap: 14,
    paddingTop: 8,
  },
  draftFullCard: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1, borderColor: C.border,
  },
  draftFullThumb: {
    width: 100, height: 100,
    overflow: 'hidden',
    backgroundColor: C.shimmer1,
  },
  draftFullOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  draftFullProgress: {
    fontSize: 18, fontWeight: '800', color: '#FFF',
  },
  draftFullTrack: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 3, backgroundColor: 'rgba(255,255,255,0.3)',
  },
  draftFullFill: {
    height: 3, backgroundColor: C.accent,
  },
  draftFullInfo: {
    flex: 1, padding: 14, justifyContent: 'center', gap: 4,
  },
  draftFullTitle: {
    fontSize: 14, fontWeight: '700', color: C.ink,
    letterSpacing: -0.2,
  },
  draftFullMeta: {
    fontSize: 12, color: C.muted,
  },
  draftFullActions: {
    flexDirection: 'row', marginTop: 6,
  },
  editPill: {
    backgroundColor: C.accentBg,
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 8,
  },
  editPillText: {
    fontSize: 11, fontWeight: '700', color: C.accent,
  },
});

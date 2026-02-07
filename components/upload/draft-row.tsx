/**
 * DraftRow — horizontal scrollable draft cards with progress indicators
 */
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C, DraftItem, timeAgo } from './constants';

interface Props {
  drafts: DraftItem[];
  onDraftPress?: (draft: DraftItem) => void;
}

export function DraftRow({ drafts, onDraftPress }: Props) {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1, duration: 600, delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  if (drafts.length === 0) return null;

  return (
    <Animated.View
      style={[
        s.wrap,
        {
          opacity: entrance,
          transform: [{
            translateY: entrance.interpolate({
              inputRange: [0, 1], outputRange: [20, 0],
            }),
          }],
        },
      ]}
    >
      <View style={s.titleRow}>
        <View>
          <Text style={s.title}>Drafts</Text>
          <Text style={s.subtitle}>{drafts.length} unfinished</Text>
        </View>
        <Pressable hitSlop={10}>
          <Text style={s.seeAll}>See all</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {drafts.map((draft, i) => (
          <DraftCard
            key={draft.id}
            draft={draft}
            index={i}
            onPress={() => onDraftPress?.(draft)}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

/* ── Individual draft card ────────────────────────────────────────────── */
function DraftCard({ draft, index, onPress }: {
  draft: DraftItem;
  index: number;
  onPress: () => void;
}) {
  const { title, thumbnail, progress, lastEdited, duration } = draft;

  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1, duration: 450, delay: 300 + index * 100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  /* image fade */
  const imgOp = useRef(new Animated.Value(0)).current;
  const onLoad = useCallback(() => {
    Animated.timing(imgOp, {
      toValue: 1, duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View
      style={[
        s.card,
        {
          opacity: anim,
          transform: [{
            translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }),
          }],
        },
      ]}
    >
      <Pressable
        onPressIn={() => Animated.spring(scale, { toValue: 0.96, friction: 8, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
        onPress={onPress}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          {/* Thumbnail */}
          <View style={s.thumbWrap}>
            <View style={s.placeholder} />
            <Animated.Image
              source={{ uri: thumbnail }}
              style={[StyleSheet.absoluteFillObject, { opacity: imgOp, borderRadius: 14 }]}
              resizeMode="cover"
              onLoad={onLoad}
            />
            {/* Draft badge */}
            <View style={s.draftBadge}>
              <Text style={s.draftBadgeText}>Draft</Text>
            </View>
            {/* Progress bar at bottom of thumbnail */}
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: `${progress * 100}%` as any }]} />
            </View>
          </View>

          {/* Info */}
          <Text style={s.cardTitle} numberOfLines={1}>{title}</Text>
          <View style={s.cardMeta}>
            <Text style={s.metaText}>{Math.round(progress * 100)}% done</Text>
            <View style={s.metaDot} />
            <Text style={s.metaText}>{timeAgo(lastEdited)}</Text>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14,
  },
  title: {
    fontSize: 18, fontWeight: '800', color: C.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12, color: C.muted, marginTop: 2,
  },
  seeAll: {
    fontSize: 13, fontWeight: '700', color: C.accent,
  },

  scroll: {
    paddingHorizontal: 20, gap: 12,
  },

  card: {
    width: 155,
  },
  thumbWrap: {
    height: 110, borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: C.shimmer1,
    marginBottom: 10,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
  },

  draftBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: 'rgba(10, 37, 64, 0.7)',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6,
  },
  draftBadgeText: {
    fontSize: 10, fontWeight: '700', color: '#FFF',
  },

  progressTrack: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 3, backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressFill: {
    height: 3, backgroundColor: C.accent,
  },

  cardTitle: {
    fontSize: 13, fontWeight: '700', color: C.ink,
    letterSpacing: -0.2, marginBottom: 4,
    paddingHorizontal: 2,
  },
  cardMeta: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 2,
  },
  metaText: {
    fontSize: 11, color: C.muted,
  },
  metaDot: {
    width: 3, height: 3, borderRadius: 1.5,
    backgroundColor: C.subtle,
  },
});

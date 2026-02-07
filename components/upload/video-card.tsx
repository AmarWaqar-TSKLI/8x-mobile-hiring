/**
 * VideoCard — thumbnail card for the upload grid
 *
 * Shows thumbnail with overlay (duration, status badge, views),
 * title, campaign tag, engagement row.
 */
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { C, VideoItem, formatViews, statusMeta, timeAgo } from './constants';

interface Props {
  video: VideoItem;
  index: number;
  onPress?: (video: VideoItem) => void;
}

const CARD_GAP  = 12;

export function VideoCard({ video, index, onPress }: Props) {
  const { width: screenW } = useWindowDimensions();
  const CARD_W  = (screenW - 40 - CARD_GAP) / 2;
  const THUMB_H = CARD_W * 1.35;
  const { title, thumbnail, duration, views, likes, status, campaign, uploadedAt, earnings } = video;
  const meta = statusMeta(status);

  /* stagger entrance */
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1, duration: 550,
      delay: index * 90,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  /* image fade-in */
  const imgOpacity = useRef(new Animated.Value(0)).current;
  const onLoad = useCallback(() => {
    Animated.timing(imgOpacity, {
      toValue: 1, duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  /* press scale */
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View
      style={[
        s.card,
        {
          width: CARD_W,
          opacity: anim,
          transform: [{
            translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }),
          }],
        },
      ]}
    >
      <Pressable
        onPressIn={() => Animated.spring(scale, { toValue: 0.96, friction: 8, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
        onPress={() => onPress?.(video)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          {/* ── Thumbnail ────────────────────────────────────────── */}
          <View style={[s.thumbWrap, { height: THUMB_H }]}>
            {/* Subtle placeholder */}
            <View style={s.placeholder} />

            <Animated.Image
              source={{ uri: thumbnail }}
              style={[StyleSheet.absoluteFillObject, { opacity: imgOpacity, borderRadius: 16 }]}
              resizeMode="cover"
              onLoad={onLoad}
            />

            {/* Gradient overlay at bottom */}
            <View style={s.gradientOverlay} />

            {/* Duration pill */}
            <View style={s.durationPill}>
              <Text style={s.durationText}>{duration}</Text>
            </View>

            {/* Status badge */}
            <View style={[s.statusBadge, { backgroundColor: meta.bg }]}>
              <View style={[s.statusDot, { backgroundColor: meta.dot }]} />
              <Text style={[s.statusText, { color: meta.text }]}>{meta.label}</Text>
            </View>

            {/* Views overlay */}
            <View style={s.viewsOverlay}>
              <View style={s.playIcon}>
                <View style={s.playTriangle} />
              </View>
              <Text style={s.viewsText}>{formatViews(views)}</Text>
            </View>

            {/* Processing indicator */}
            {status === 'processing' && (
              <ProcessingOverlay />
            )}
          </View>

          {/* ── Info ──────────────────────────────────────────────── */}
          <View style={s.info}>
            <Text style={s.title} numberOfLines={2}>{title}</Text>

            <View style={s.metaRow}>
              {campaign && (
                <View style={s.campaignPill}>
                  <Text style={s.campaignText}>{campaign}</Text>
                </View>
              )}
              <Text style={s.timeText}>{timeAgo(uploadedAt)}</Text>
            </View>

            {/* Engagement row */}
            <View style={s.engageRow}>
              <View style={s.engageItem}>
                <Text style={s.engageIcon}>♥</Text>
                <Text style={s.engageNum}>{formatViews(likes)}</Text>
              </View>
              {earnings != null && earnings > 0 && (
                <View style={s.earningsPill}>
                  <Text style={s.earningsText}>${earnings}</Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/* ── Processing pulsing overlay ───────────────────────────────────────── */
function ProcessingOverlay() {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.7, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={[s.processingOverlay, { opacity: pulse }]}>
      <View style={s.processingSpinner}>
        <View style={s.spinnerArc} />
      </View>
      <Text style={s.processingText}>Processing...</Text>
    </Animated.View>
  );
}

export { CARD_GAP };

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  card: {
    marginBottom: 16,
  },

  thumbWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: C.shimmer1,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.shimmer1,
  },

  gradientOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 60,
    backgroundColor: 'transparent',
    // Fake gradient with layered opacity
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  /* badges */
  durationPill: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 11, fontWeight: '700', color: '#FFF',
    letterSpacing: 0.3,
  },

  statusBadge: {
    position: 'absolute', top: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8,
  },
  statusDot: {
    width: 6, height: 6, borderRadius: 3,
  },
  statusText: {
    fontSize: 10, fontWeight: '700',
    letterSpacing: 0.2,
  },

  viewsOverlay: {
    position: 'absolute', bottom: 8, right: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6,
  },
  playIcon: {
    width: 10, height: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  playTriangle: {
    width: 0, height: 0,
    borderLeftWidth: 7, borderLeftColor: '#FFF',
    borderTopWidth: 4, borderTopColor: 'transparent',
    borderBottomWidth: 4, borderBottomColor: 'transparent',
  },
  viewsText: {
    fontSize: 11, fontWeight: '700', color: '#FFF',
  },

  /* processing overlay */
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 37, 64, 0.65)',
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  processingSpinner: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.25)',
    borderTopColor: '#FFF',
    marginBottom: 6,
  },
  spinnerArc: {},
  processingText: {
    fontSize: 12, fontWeight: '700', color: '#FFF',
    letterSpacing: 0.3,
  },

  /* info */
  info: {
    paddingTop: 10, paddingHorizontal: 2,
  },
  title: {
    fontSize: 13, fontWeight: '700', color: C.ink,
    lineHeight: 18, letterSpacing: -0.2,
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 6,
  },
  campaignPill: {
    backgroundColor: C.accentBg,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 6,
  },
  campaignText: {
    fontSize: 10, fontWeight: '700', color: C.accent,
    letterSpacing: 0.2,
  },
  timeText: {
    fontSize: 11, color: C.muted,
  },

  engageRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  engageItem: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  engageIcon: {
    fontSize: 11, color: C.pink,
  },
  engageNum: {
    fontSize: 11, fontWeight: '600', color: C.inkSoft,
  },
  earningsPill: {
    backgroundColor: C.greenBg,
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 6,
  },
  earningsText: {
    fontSize: 10, fontWeight: '800', color: C.greenText,
  },
});

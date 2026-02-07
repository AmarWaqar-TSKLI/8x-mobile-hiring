/**
 * CampaignCard — premium card component for feed
 *
 * Brand header · hero image · copy · meta · CTA
 */
import React, { useCallback, useRef, useState } from 'react';
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
import { useRouter } from 'expo-router';
import { C, Campaign, daysUntil, statusMeta } from './constants';

interface Props {
  campaign: Campaign;
  index: number;
}

/* ── Verified badge ───────────────────────────────────────────────────── */
function VerifiedBadge() {
  return (
    <View style={v.badge}>
      <Text style={v.check}>✓</Text>
    </View>
  );
}
const v = StyleSheet.create({
  badge: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 5,
  },
  check: { fontSize: 10, fontWeight: '800', color: '#FFF', marginTop: -1 },
});

/* ── CampaignCard ─────────────────────────────────────────────────────── */
export function CampaignCard({ campaign, index }: Props) {
  const router = useRouter();
  const {
    brand, title, description, pay, category,
    deadline, image, applicants, slots, status,
  } = campaign;

  const days = daysUntil(deadline);
  const meta = statusMeta(status);

  /* entrance stagger */
  const entrance = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 600,
      delay: index * 80,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  /* CTA press animation */
  const btnScale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(btnScale, { toValue: 0.96, friction: 8, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  /* Image loading */
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgOpacity = useRef(new Animated.Value(0)).current;
  const onImageLoad = useCallback(() => {
    setImgLoaded(true);
    Animated.timing(imgOpacity, {
      toValue: 1, duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const { width: screenW } = useWindowDimensions();
  const IMAGE_H = (screenW - 40 - 40) * 0.52;

  return (
    <Animated.View
      style={[
        s.card,
        {
          opacity: entrance,
          transform: [{
            translateY: entrance.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 0],
            }),
          }],
        },
      ]}
    >
      {/* ── Brand header ──────────────────────────────────────────── */}
      <View style={s.brandRow}>
        <View style={[s.brandAvatar, { backgroundColor: brand.color }]}>
          <Text style={[s.brandInitial, brand.color === '#111111' || brand.color === '#1A1A1A' || brand.color === '#1428A0' ? { color: '#FFF' } : { color: '#FFF' }]}>
            {brand.initial}
          </Text>
        </View>
        <View style={s.brandInfo}>
          <View style={s.brandNameRow}>
            <Text style={s.brandName} numberOfLines={1}>{brand.name}</Text>
            {brand.verified && <VerifiedBadge />}
          </View>
          <Text style={s.brandCategory}>{category}</Text>
        </View>
        <View style={s.payPill}>
          <Text style={s.payText}>${pay}</Text>
        </View>
      </View>

      {/* ── Hero image ────────────────────────────────────────────── */}
      <View style={[s.imageWrap, { height: IMAGE_H }]}>
        {/* coloured placeholder while loading */}
        <View style={[s.imagePlaceholder, { backgroundColor: brand.color + '18' }]} />
        <Animated.Image
          source={{ uri: image }}
          style={[s.image, { opacity: imgOpacity }]}
          resizeMode="cover"
          onLoad={onImageLoad}
        />
        {/* Deadline badge overlay */}
        {days > 0 && (
          <View style={s.deadlineBadge}>
            <Text style={s.deadlineIcon}>⏱</Text>
            <Text style={s.deadlineText}>{days}d left</Text>
          </View>
        )}
      </View>

      {/* ── Content ───────────────────────────────────────────────── */}
      <Text style={s.title} numberOfLines={2}>{title}</Text>
      <Text style={s.description} numberOfLines={2}>{description}</Text>

      {/* ── Meta row ──────────────────────────────────────────────── */}
      <View style={s.metaRow}>
        <View style={s.metaItem}>
          <View style={s.metaDot} />
          <Text style={s.metaText}>
            {applicants}{slots ? `/${slots}` : ''} applied
          </Text>
        </View>
        <View style={s.metaSep} />
        <View style={s.metaItem}>
          <View style={[s.metaDot, { backgroundColor: C.accentAlt }]} />
          <Text style={s.metaText}>
            {slots - applicants > 0 ? `${slots - applicants} spots left` : 'Full'}
          </Text>
        </View>
      </View>

      {/* ── Applicant bar ────────────────────────────────────────── */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${Math.min(100, (applicants / slots) * 100)}%` as any }]} />
      </View>

      {/* ── CTA button ────────────────────────────────────────────── */}
      <Pressable onPressIn={onIn} onPressOut={onOut} disabled={status === 'completed'}
        onPress={() => router.push(`/campaign/${campaign.id}` as any)}
      >
        <Animated.View
          style={[
            s.ctaBtn,
            { backgroundColor: meta.bg, transform: [{ scale: btnScale }] },
            status === 'completed' && { opacity: 0.7 },
          ]}
        >
          <Text style={[s.ctaText, { color: meta.text }]}>{meta.label}</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
    elevation: 2,
  },

  /* brand header */
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  brandAvatar: {
    width: 42, height: 42, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  brandInitial: {
    fontSize: 17, fontWeight: '800', color: '#FFF',
  },
  brandInfo: { flex: 1 },
  brandNameRow: { flexDirection: 'row', alignItems: 'center' },
  brandName: { fontSize: 15, fontWeight: '700', color: C.ink },
  brandCategory: { fontSize: 12, fontWeight: '500', color: C.muted, marginTop: 2 },

  payPill: {
    backgroundColor: C.greenBg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  payText: { fontSize: 15, fontWeight: '800', color: C.greenText },

  /* hero image */
  imageWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: C.shimmer1,
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  deadlineBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(10, 37, 64, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  deadlineIcon: { fontSize: 11 },
  deadlineText: { fontSize: 12, fontWeight: '700', color: '#FFF' },

  /* content */
  title: {
    fontSize: 18, fontWeight: '800', color: C.ink,
    letterSpacing: -0.6, lineHeight: 24, marginBottom: 6,
  },
  description: {
    fontSize: 14, lineHeight: 20, color: C.muted,
    marginBottom: 14,
  },

  /* meta */
  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 10,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.accent },
  metaSep: { width: 1, height: 12, backgroundColor: C.border, marginHorizontal: 4 },
  metaText: { fontSize: 13, fontWeight: '500', color: C.inkSoft },

  /* progress */
  progressTrack: {
    height: 4, borderRadius: 2,
    backgroundColor: C.border,
    marginBottom: 18,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4, borderRadius: 2,
    backgroundColor: C.accent,
  },

  /* CTA */
  ctaBtn: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 15, borderRadius: 14,
  },
  ctaText: {
    fontSize: 15, fontWeight: '700', letterSpacing: -0.2,
  },
});

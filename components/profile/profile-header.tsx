/**
 * ProfileHeader — hero section with avatar, stats, bio, and action row
 *
 * Features:
 * - Large circular avatar with accent ring + verified badge
 * - Follower / Following / Content stat row
 * - Bio with niche tags and location
 * - Edit Profile + Share quick-action buttons
 * - All elements stagger-fade on mount
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C, formatCompact, PROFILE } from './constants';

interface ProfileHeaderProps {
  onSettingsPress?: () => void;
}

export function ProfileHeader({ onSettingsPress }: ProfileHeaderProps) {
  /* staggered entrance */
  const avatarY   = useRef(new Animated.Value(24)).current;
  const avatarO   = useRef(new Animated.Value(0)).current;
  const statsY    = useRef(new Animated.Value(20)).current;
  const statsO    = useRef(new Animated.Value(0)).current;
  const bioY      = useRef(new Animated.Value(16)).current;
  const bioO      = useRef(new Animated.Value(0)).current;
  const actionsY  = useRef(new Animated.Value(14)).current;
  const actionsO  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (y: Animated.Value, o: Animated.Value, delay: number) =>
      Animated.parallel([
        Animated.timing(y, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
        Animated.timing(o, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
      ]);

    Animated.stagger(80, [
      animate(avatarY, avatarO, 0),
      animate(statsY, statsO, 0),
      animate(bioY, bioO, 0),
      animate(actionsY, actionsO, 0),
    ]).start();
  }, []);

  const p = PROFILE;

  return (
    <View style={s.root}>
      {/* ── Avatar row ──────────────────────────────────────────────── */}
      <Animated.View style={[s.avatarRow, { opacity: avatarO, transform: [{ translateY: avatarY }] }]}>  
        <View style={s.avatarWrap}>
          <View style={s.avatarRing}>
            <Image source={{ uri: p.avatar }} style={s.avatar} />
          </View>
          {p.verified && (
            <View style={s.verifiedBadge}>
              <Text style={s.verifiedIcon}>✓</Text>
            </View>
          )}
        </View>

        <View style={s.nameCol}>
          <View style={s.nameRow}>
            <Text style={s.name}>{p.name}</Text>
          </View>
          <Text style={s.handle}>{p.handle}</Text>
          <View style={s.locationRow}>
            <Text style={s.locationPin}>📍</Text>
            <Text style={s.locationText}>{p.location}</Text>
          </View>
        </View>
      </Animated.View>

      {/* ── Stat row ────────────────────────────────────────────────── */}
      <Animated.View style={[s.statRow, { opacity: statsO, transform: [{ translateY: statsY }] }]}>
        <StatBlock value={formatCompact(p.followers)} label="Followers" />
        <View style={s.statDivider} />
        <StatBlock value={formatCompact(p.following)} label="Following" />
        <View style={s.statDivider} />
        <StatBlock value={String(p.totalContent)} label="Content" />
      </Animated.View>

      {/* ── Bio ─────────────────────────────────────────────────────── */}
      <Animated.View style={[s.bioWrap, { opacity: bioO, transform: [{ translateY: bioY }] }]}>
        <Text style={s.bioText}>{p.bio}</Text>

        {/* niche tags */}
        <View style={s.tagRow}>
          {p.niche.map(n => (
            <View key={n} style={s.tag}>
              <Text style={s.tagText}>{n}</Text>
            </View>
          ))}
          {p.website && (
            <View style={[s.tag, s.tagLink]}>
              <Text style={s.tagLinkText}>🔗 {p.website}</Text>
            </View>
          )}
        </View>

        {/* joined date */}
        <Text style={s.joined}>
          Joined {new Date(p.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
      </Animated.View>

      {/* ── Action buttons ──────────────────────────────────────────── */}
      <Animated.View style={[s.actionRow, { opacity: actionsO, transform: [{ translateY: actionsY }] }]}>
        <Pressable style={s.btnPrimary}>
          <Text style={s.btnPrimaryText}>Edit Profile</Text>
        </Pressable>
        <Pressable style={s.btnSecondary}>
          <Text style={s.btnSecondaryText}>Share Profile</Text>
        </Pressable>
        <Pressable style={s.btnIcon} onPress={onSettingsPress}>
          <Text style={s.btnIconText}>⚙️</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

/* ── stat block ───────────────────────────────────────────────────────── */
function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },

  /* avatar row */
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  avatarWrap: { position: 'relative' },
  avatarRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: C.accent,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: C.bg,
  },
  verifiedIcon: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
    marginTop: -1,
  },

  /* name + handle */
  nameCol: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.6,
  },
  handle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.muted,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  locationPin: { fontSize: 12 },
  locationText: { fontSize: 12, fontWeight: '600', color: C.subtle },

  /* stat row */
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderRadius: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.muted,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: C.border,
  },

  /* bio */
  bioWrap: { marginTop: 18 },
  bioText: {
    fontSize: 14,
    lineHeight: 21,
    color: C.inkSoft,
    letterSpacing: -0.1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    backgroundColor: C.accentBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.accent,
  },
  tagLink: {
    backgroundColor: '#EDF9F5',
  },
  tagLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.greenText,
  },
  joined: {
    fontSize: 12,
    color: C.subtle,
    marginTop: 10,
    fontWeight: '500',
  },

  /* action buttons */
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: C.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: -0.2,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: C.surface,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.ink,
    letterSpacing: -0.2,
  },
  btnIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
  },
  btnIconText: { fontSize: 18 },
});

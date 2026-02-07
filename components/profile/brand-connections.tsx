/**
 * BrandConnections — partner brands with status indicators
 *
 * Features:
 * - Horizontal card for each brand partner
 * - Initial-based logo with brand colour
 * - Status pill (Active / Completed / Invited)
 * - Campaign count + lifetime earnings per brand
 * - Staggered entrance animation
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C, BRAND_PARTNERS } from './constants';
import type { BrandPartner } from './constants';

export function BrandConnections() {
  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.heading}>Brand Partners</Text>
        <Text style={s.count}>{BRAND_PARTNERS.length} brands</Text>
      </View>

      <View style={s.list}>
        {BRAND_PARTNERS.map((b, i) => (
          <BrandCard key={b.id} brand={b} index={i} />
        ))}
      </View>
    </View>
  );
}

/* ── brand card row ───────────────────────────────────────────────────── */
function BrandCard({ brand, index }: { brand: BrandPartner; index: number }) {
  const x = useRef(new Animated.Value(30)).current;
  const o = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 80;
    Animated.parallel([
      Animated.timing(x, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(o, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const statusStyle = statusMeta(brand.status);

  return (
    <Animated.View style={[s.card, { opacity: o, transform: [{ translateX: x }] }]}>
      {/* logo circle */}
      <View style={[s.logo, { backgroundColor: brand.color }]}>
        <Text style={[s.logoText, isLightBg(brand.color) && { color: '#333' }]}>
          {brand.initial}
        </Text>
      </View>

      {/* info */}
      <View style={s.info}>
        <View style={s.nameRow}>
          <Text style={s.brandName}>{brand.name}</Text>
          <View style={[s.statusPill, { backgroundColor: statusStyle.bg }]}>
            <View style={[s.statusDot, { backgroundColor: statusStyle.color }]} />
            <Text style={[s.statusText, { color: statusStyle.color }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        <View style={s.metaRow}>
          {brand.campaigns > 0 && (
            <Text style={s.meta}>
              {brand.campaigns} campaign{brand.campaigns !== 1 ? 's' : ''}
            </Text>
          )}
          {brand.earned > 0 && (
            <>
              <View style={s.metaDot} />
              <Text style={s.metaEarn}>${brand.earned}</Text>
            </>
          )}
          {brand.status === 'invited' && (
            <Pressable style={s.acceptBtn}>
              <Text style={s.acceptText}>View Invite</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* chevron */}
      <Text style={s.chevron}>›</Text>
    </Animated.View>
  );
}

/* ── helpers ──────────────────────────────────────────────────────────── */
function statusMeta(status: BrandPartner['status']) {
  switch (status) {
    case 'active':    return { label: 'Active',    color: C.greenText, bg: C.greenBg };
    case 'completed': return { label: 'Completed', color: C.muted,     bg: '#F1F5F9' };
    case 'invited':   return { label: 'Invited',   color: C.accent,    bg: C.accentBg };
  }
}

function isLightBg(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { marginTop: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  heading: {
    fontSize: 17,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.4,
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
    color: C.muted,
  },

  list: {
    paddingHorizontal: 20,
    gap: 10,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
    gap: 14,
  },

  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },

  info: { flex: 1, gap: 5 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink,
    letterSpacing: -0.2,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontSize: 12,
    fontWeight: '600',
    color: C.muted,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.subtle,
  },
  metaEarn: {
    fontSize: 12,
    fontWeight: '700',
    color: C.greenText,
  },
  acceptBtn: {
    backgroundColor: C.accentBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  acceptText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.accent,
  },

  chevron: {
    fontSize: 20,
    fontWeight: '300',
    color: C.subtle,
  },
});

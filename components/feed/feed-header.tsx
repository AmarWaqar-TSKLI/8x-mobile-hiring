/**
 * FeedHeader — greeting bar + filter pills
 */
import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C, FILTERS } from './constants';

interface Props {
  userName?: string;
}

/* ── Notification bell icon (View-based) ─────────────────────────────── */
function BellIcon() {
  return (
    <View style={bell.wrap}>
      <View style={bell.body} />
      <View style={bell.clapper} />
      <View style={bell.dot} />
    </View>
  );
}
const bell = StyleSheet.create({
  wrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'flex-end' },
  body: {
    width: 16, height: 14, borderRadius: 8,
    borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
    backgroundColor: C.ink,
  },
  clapper: {
    width: 6, height: 3, borderRadius: 1.5,
    backgroundColor: C.ink, marginTop: 1,
  },
  dot: {
    position: 'absolute', top: 0, right: 0,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: C.accent,
    borderWidth: 1.5, borderColor: C.bg,
  },
});

/* ── Search icon (View-based) ────────────────────────────────────────── */
function SearchIcon() {
  return (
    <View style={si.wrap}>
      <View style={si.circle} />
      <View style={si.handle} />
    </View>
  );
}
const si = StyleSheet.create({
  wrap: { width: 22, height: 22 },
  circle: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 2.5, borderColor: C.ink,
    position: 'absolute', top: 0, left: 0,
  },
  handle: {
    width: 9, height: 2.5, borderRadius: 1.25,
    backgroundColor: C.ink,
    position: 'absolute', top: 13, left: 12,
    transform: [{ rotate: '45deg' }],
  },
});

/* ── Header ──────────────────────────────────────────────────────────── */
export function FeedHeader({ userName = 'Creator' }: Props) {
  const [activeFilter, setActiveFilter] = useState(0);
  const underlineX = useRef(new Animated.Value(0)).current;

  // Entrance
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY       = useRef(new Animated.Value(20)).current;
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1, duration: 700,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.spring(headerY, {
        toValue: 0, friction: 10, tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <Animated.View
      style={[
        s.container,
        { opacity: headerOpacity, transform: [{ translateY: headerY }] },
      ]}
    >
      {/* Top bar: logo + icons */}
      <View style={s.topBar}>
        <View style={s.logoWrap}>
          <Text style={s.logo}>8x</Text>
          <View style={s.logoDot} />
        </View>
        <View style={s.topIcons}>
          <Pressable style={s.iconBtn} hitSlop={10}>
            <SearchIcon />
          </Pressable>
          <Pressable style={s.iconBtn} hitSlop={10}>
            <BellIcon />
          </Pressable>
        </View>
      </View>

      {/* Greeting */}
      <Text style={s.greeting}>{greeting}, {userName.split(' ')[0]}</Text>
      <Text style={s.subtitle}>Discover campaigns tailored for you</Text>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterScroll}
        style={s.filterWrap}
      >
        {FILTERS.map((label, idx) => {
          const active = idx === activeFilter;
          return (
            <Pressable
              key={label}
              onPress={() => setActiveFilter(idx)}
              style={[s.filterPill, active && s.filterPillActive]}
            >
              <Text style={[s.filterText, active && s.filterTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: C.bg,
  },

  /* top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center' },
  logo: {
    fontSize: 28, fontWeight: '900', color: C.ink,
    letterSpacing: -2,
  },
  logoDot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: C.accent, marginLeft: 3, marginTop: -10,
  },
  topIcons: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },

  /* greeting */
  greeting: {
    fontSize: 26, fontWeight: '800', color: C.ink,
    letterSpacing: -1, marginBottom: 4,
  },
  subtitle: {
    fontSize: 15, color: C.muted, marginBottom: 20,
  },

  /* filters */
  filterWrap: { marginBottom: 4, marginHorizontal: -20 },
  filterScroll: { paddingHorizontal: 20, gap: 8 },
  filterPill: {
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 50, backgroundColor: C.surface,
    borderWidth: 1.5, borderColor: C.border,
  },
  filterPillActive: {
    backgroundColor: C.ink,
    borderColor: C.ink,
  },
  filterText: {
    fontSize: 13, fontWeight: '600', color: C.muted,
  },
  filterTextActive: {
    color: '#FFF',
  },
});

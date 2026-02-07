/**
 * UploadHeader — branded top bar with search + filter actions
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { C } from './constants';

type Tab = 'all' | 'published' | 'drafts' | 'review';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'drafts',    label: 'Drafts' },
  { key: 'review',    label: 'In Review' },
];

export function UploadHeader({ activeTab, onTabChange }: Props) {
  /* entrance animation */
  const opacity = useRef(new Animated.Value(0)).current;
  const ty      = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 600,
        easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.spring(ty, {
        toValue: 0, friction: 10, tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[s.wrap, { opacity, transform: [{ translateY: ty }] }]}>
      {/* Title row */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.title}>My Content</Text>
          <Text style={s.subtitle}>Manage your videos & drafts</Text>
        </View>
        {/* Grid / List toggle icon */}
        <Pressable style={s.iconBtn} hitSlop={10}>
          <View style={s.gridIcon}>
            {[0,1,2,3].map(i => (
              <View key={i} style={s.gridDot} />
            ))}
          </View>
        </Pressable>
      </View>

      {/* Segmented tabs */}
      <View style={s.tabRow}>
        {TABS.map(t => {
          const active = t.key === activeTab;
          return (
            <Pressable
              key={t.key}
              onPress={() => onTabChange(t.key)}
              style={[s.tab, active && s.tabActive]}
            >
              <Text style={[s.tabText, active && s.tabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: C.bg,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 28, fontWeight: '800', color: C.ink,
    letterSpacing: -1.2,
  },
  subtitle: {
    fontSize: 14, color: C.muted, marginTop: 3,
  },

  iconBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: C.surface,
    borderWidth: 1.5, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  gridIcon: {
    width: 18, height: 18,
    flexDirection: 'row', flexWrap: 'wrap', gap: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  gridDot: {
    width: 6, height: 6, borderRadius: 2,
    backgroundColor: C.ink,
  },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: C.border,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: C.ink,
  },
  tabText: {
    fontSize: 12, fontWeight: '700', color: C.muted,
    letterSpacing: 0.1,
  },
  tabTextActive: {
    color: '#FFF',
  },
});

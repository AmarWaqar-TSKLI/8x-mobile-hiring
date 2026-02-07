/**
 * SettingsSection — preferences & account management
 *
 * Features:
 * - Grouped setting rows with icons
 * - Toggle switches (notifications, dark mode)
 * - Navigation chevrons
 * - Badge pills for counts (payment methods)
 * - Danger-styled Sign Out item
 * - Staggered entrance per row
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { C, SETTINGS } from './constants';
import type { SettingItem } from './constants';

export function SettingsSection() {
  const router = useRouter();

  const handleSignOut = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  return (
    <View style={s.root}>
      <View style={s.card}>
        {SETTINGS.map((item, i) => (
          <SettingRow
            key={item.id}
            item={item}
            index={i}
            isLast={i === SETTINGS.length - 1}
            onSignOut={item.danger ? handleSignOut : undefined}
          />
        ))}
      </View>

      {/* app version footer */}
      <Text style={s.version}>8x Creator v1.0.0</Text>
    </View>
  );
}

/* ── individual row ───────────────────────────────────────────────────── */
function SettingRow({ item, index, isLast, onSignOut }: { item: SettingItem; index: number; isLast: boolean; onSignOut?: () => void }) {
  const [toggled, setToggled] = useState(item.value ?? false);
  const o = useRef(new Animated.Value(0)).current;
  const x = useRef(new Animated.Value(14)).current;

  /* toggle thumb animation */
  const thumbX = useRef(new Animated.Value(toggled ? 20 : 2)).current;

  useEffect(() => {
    const delay = index * 50;
    Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(x, { toValue: 0, duration: 380, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleToggle = useCallback(() => {
    const next = !toggled;
    setToggled(next);
    Animated.spring(thumbX, {
      toValue: next ? 20 : 2,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [toggled]);

  return (
    <Animated.View style={{ opacity: o, transform: [{ translateX: x }] }}>
      <Pressable
        style={[s.row, !isLast && s.rowBorder]}
        onPress={item.type === 'toggle' ? handleToggle : item.danger ? onSignOut : undefined}
      >
        {/* icon */}
        <View style={[s.iconCircle, item.danger && s.iconCircleDanger]}>
          <Text style={s.iconEmoji}>{item.icon}</Text>
        </View>

        {/* label */}
        <Text style={[s.label, item.danger && s.labelDanger]} numberOfLines={1}>
          {item.label}
        </Text>

        {/* right element */}
        {item.type === 'toggle' && (
          <CustomToggle active={toggled} thumbX={thumbX} onPress={handleToggle} />
        )}
        {item.type === 'navigation' && !item.badgeText && !item.danger && (
          <Text style={s.chevron}>›</Text>
        )}
        {item.badgeText && (
          <View style={s.badge}>
            <Text style={s.badgeText}>{item.badgeText}</Text>
          </View>
        )}
        {item.danger && (
          <Text style={[s.chevron, { color: C.danger }]}>›</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

/* ── custom toggle switch ─────────────────────────────────────────────── */
function CustomToggle({
  active,
  thumbX,
  onPress,
}: {
  active: boolean;
  thumbX: Animated.Value;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[s.track, active && s.trackActive]}
      onPress={onPress}
      hitSlop={6}
    >
      <Animated.View
        style={[s.thumb, { transform: [{ translateX: thumbX }] }]}
      />
    </Pressable>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: { marginTop: 24, paddingBottom: 40 },
  heading: {
    fontSize: 17,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.4,
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  card: {
    marginHorizontal: 20,
    backgroundColor: C.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleDanger: {
    backgroundColor: '#FFF0F0',
  },
  iconEmoji: { fontSize: 16 },

  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: C.ink,
    letterSpacing: -0.2,
  },
  labelDanger: {
    color: C.danger,
  },

  chevron: {
    fontSize: 20,
    fontWeight: '300',
    color: C.subtle,
  },

  badge: {
    backgroundColor: C.accentBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: C.accent,
  },

  /* toggle */
  track: {
    width: 42,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
  },
  trackActive: {
    backgroundColor: C.accent,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 2,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  },

  /* version */
  version: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: C.subtle,
    marginTop: 24,
  },
});

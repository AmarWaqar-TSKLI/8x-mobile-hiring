/**
 * Custom Tab Bar — premium bottom navigation
 *
 * Feed · Upload (elevated) · Profile
 */
import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const C = {
  bg:      '#FFFFFF',
  ink:     '#0A2540',
  muted:   '#94A3B8',
  accent:  '#635BFF',
  border:  '#F1F5F9',
};

/* ── Tiny View-based icons ────────────────────────────────────────────── */

function FeedIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 22, height: 22, gap: 3 }}>
      <View style={{ flex: 1, flexDirection: 'row', gap: 3 }}>
        <View style={{ flex: 1, backgroundColor: color, borderRadius: 3 }} />
        <View style={{ flex: 2, backgroundColor: color, borderRadius: 3 }} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', gap: 3 }}>
        <View style={{ flex: 2, backgroundColor: color, borderRadius: 3 }} />
        <View style={{ flex: 1, backgroundColor: color, borderRadius: 3 }} />
      </View>
    </View>
  );
}

function UploadIcon() {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 16, height: 2.5, borderRadius: 1.25, backgroundColor: '#FFF' }} />
      <View style={{ width: 2.5, height: 16, borderRadius: 1.25, backgroundColor: '#FFF', position: 'absolute' }} />
    </View>
  );
}

function ProfileIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center' }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
      <View style={{
        width: 18, height: 9, borderTopLeftRadius: 9, borderTopRightRadius: 9,
        backgroundColor: color, marginTop: 2,
      }} />
    </View>
  );
}

/* ── Only these three routes render as visible tabs ───────────────────── */
const TAB_ROUTES = ['feed', 'upload', 'profile'] as const;

/* ── Tab bar component ────────────────────────────────────────────────── */
export function CustomTabBar({ state, descriptors, navigation, onUploadPress }: BottomTabBarProps & { onUploadPress?: () => void }) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name;

  // Hide the entire tab bar on campaign detail (and any other non-tab route)
  if (!TAB_ROUTES.includes(activeRoute as any)) {
    return null;
  }

  return (
    <View style={[s.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={s.inner}>
        {TAB_ROUTES.map((tabName) => {
          // Find the matching route in router state
          const routeIndex = state.routes.findIndex((r) => r.name === tabName);
          if (routeIndex === -1) return null;

          const route = state.routes[routeIndex];
          const isFocused = state.index === routeIndex;
          const isUpload  = tabName === 'upload';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isUpload) {
            return (
              <UploadTab
                key={route.key}
                onPress={() => {
                  onUploadPress?.();
                  if (!isFocused) {
                    navigation.navigate(route.name);
                  }
                }}
                isFocused={isFocused}
              />
            );
          }

          const label = tabName === 'feed' ? 'Feed' : 'Profile';
          const color = isFocused ? C.accent : C.muted;

          return (
            <TabItem key={route.key} onPress={onPress}>
              {tabName === 'feed' ? (
                <FeedIcon color={color} />
              ) : (
                <ProfileIcon color={color} />
              )}
              <Text style={[s.label, isFocused && s.labelActive]}>{label}</Text>
              {isFocused && <View style={s.indicator} />}
            </TabItem>
          );
        })}
      </View>
    </View>
  );
}

/* ── Regular tab ──────────────────────────────────────────────────────── */
function TabItem({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable style={s.tabItem} onPress={onPress} hitSlop={8}>
      {children}
    </Pressable>
  );
}

/* ── Upload (elevated centre button) ─────────────────────────────────── */
function UploadTab({ onPress, isFocused }: { onPress: () => void; isFocused: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPressIn={() => Animated.spring(scale, { toValue: 0.9, friction: 8, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
      onPress={onPress}
      style={s.uploadWrap}
    >
      <Animated.View style={[s.uploadBtn, { transform: [{ scale }] }]}>
        <UploadIcon />
      </Animated.View>
      <Text style={[s.label, { marginTop: 6, color: isFocused ? C.accent : C.muted }]}>Upload</Text>
    </Pressable>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 8,
    ...(Platform.OS === 'ios'
      ? { boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.04)' }
      : { elevation: 12 }),
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  label: {
    fontSize: 11, fontWeight: '600', color: C.muted,
    letterSpacing: 0.1,
  },
  labelActive: { color: C.accent },
  indicator: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: C.accent, marginTop: 2,
  },

  uploadWrap: { alignItems: 'center', marginTop: -20 },
  uploadBtn: {
    width: 52, height: 52, borderRadius: 18,
    backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '0px 6px 16px rgba(99, 91, 255, 0.35)',
    elevation: 6,
  },
});

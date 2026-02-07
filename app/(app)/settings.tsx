/**
 * Settings Screen — dedicated full-page settings
 *
 * Exact same SettingsSection component, now in its own screen
 * instead of a modal. Navigated from Profile → gear icon.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsSection, C } from '@/components/profile';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Settings</Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <View style={s.closeBtn}>
            <Text style={s.closeBtnText}>✕</Text>
          </View>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <SettingsSection />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBF1',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A2540',
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7C93',
  },
  scrollContent: {
    paddingBottom: 40,
  },
});

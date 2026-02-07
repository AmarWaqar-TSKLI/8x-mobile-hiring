/**
 * (app) layout — main authenticated app with custom bottom tab bar
 *
 * Tabs: Feed · Upload · Profile
 *
 * The UploadFAB + UploadSheet live here (not on individual screens)
 * so the FAB is visible across all tabs and the upload tab auto-opens the sheet.
 */
import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/app/tab-bar';
import { UploadFAB, UploadSheet } from '@/components/upload';

export default function AppLayout() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleMediaSelected = useCallback((uri: string, type: 'camera' | 'library') => {
    // In production this navigates to an editor / processing screen
  }, []);

  return (
    <View style={s.root}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} onUploadPress={() => setSheetOpen(true)} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="feed"    options={{ title: 'Feed' }} />
        <Tabs.Screen name="upload"  options={{ title: 'Upload' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        <Tabs.Screen name="campaign/[id]" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
      </Tabs>

      {/* Global FAB — visible on every tab */}
      <UploadFAB onPress={() => setSheetOpen(true)} />

      {/* Global upload bottom sheet */}
      <UploadSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onMediaSelected={handleMediaSelected}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
});

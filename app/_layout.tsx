import '@/global.css';
import { LogBox } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Suppress known dependency-level warnings that we can't fix in user code
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'THREE.WARNING: Multiple instances of Three.js being imported',
]);

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="get-started" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

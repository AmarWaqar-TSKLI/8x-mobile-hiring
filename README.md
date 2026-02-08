# 8x — Project Notes

## Device / OS

Google Pixel 9, Android

## UI Library

**NativeWind** (Tailwind CSS for React Native) — chosen over the default `StyleSheet` approach for utility-first styling, faster iteration, and design-token consistency across screens.

## Initial Observations

- **Routing** — Expo Router file-based routing with a root `Stack` containing a tab navigator and a modal screen. Navigation is clean and ready to extend.
- **Theming** — Built-in light/dark support via `ThemedText` / `ThemedView` and a `useColorScheme` hook. Custom font map lives in `constants/theme.ts`.
- **Component library** — Starter ships with reusable pieces (`ParallaxScrollView`, `Collapsible`, `ExternalLink`, `HelloWave`). Good base, but styling will migrate to NativeWind classes.
- **Animations** — `react-native-reanimated` is bundled. The landing page intentionally uses only the core `Animated` API (fade-in + translate hero, staggered feature cards, spring-scale CTA button) to stay lightweight and meet the constraint.
- **Assets** — Image directory is mostly empty; splash and adaptive icon are pre-configured in `app.json`.

## Architecture

| Layer | Details |
|---|---|
| **Framework** | Expo SDK 54 · React Native 0.81.5 · React 19.1 |
| **Routing** | expo-router ~6.0 (file-based: `app/` dir) |
| **Animation** | Core `Animated` API only (no Reanimated dependency for animations) |
| **Styling** | `StyleSheet.create` with a shared colour palette (`C` constants) |
| **Tabs** | Custom bottom tab bar (`components/app/tab-bar.tsx`) with a route whitelist |

## Screen Map

| Route | Screen | States |
|---|---|---|
| `/` | Landing page | Hero, features (CardSwap), how-it-works (timeline), social proof, footer |
| `/get-started` | Sign up | Form with password strength bar, social proof avatars, Google social |
| `/sign-in` | Sign in | Branded header, form card, forgot password, Google social |
| `/onboarding` | 5-step onboarding | Phone OTP → Name → Photo → Niche/Socials → Success (with back nav) |
| `/(app)/feed` | Campaign feed | Loading skeleton · Empty state · Error + retry · Pull-to-refresh |
| `/(app)/upload` | Content manager | Skeleton · Video grid · Drafts · Empty state → Upload sheet |
| `/(app)/profile` | Creator profile | Skeleton · Header, stats, portfolio, achievements, settings |
| `/(app)/campaign/[id]` | Campaign detail | Carousel, brief, apply CTA (3-state), "not found" fallback |

## What I'd improve with more time

1. **Real API layer** — Replace mock data with a proper data-fetching layer (React Query / SWR), add network error & retry states to every screen (Upload and Profile currently lack error states).
2. **Dark mode** — The colour palette is light-only. A full dark theme with `useColorScheme` toggle and semantic tokens would make it production-ready.
3. **Accessibility (a11y)** — Add `accessibilityLabel`, `accessibilityRole`, and keyboard navigation to all interactive elements. Test with TalkBack / VoiceOver.
4. **Reanimated migration** — The core `Animated` API works but Reanimated 4 offers layout animations, shared element transitions, and better perf. The CardSwap and HowItWorks timeline would benefit.
5. **Testing** — Add unit tests for utility functions, component snapshot tests with React Native Testing Library, and E2E flows with Detox or Maestro.
6. **Auth & state management** — Wire up real auth (Clerk / Supabase), persist user state with Zustand or Context, protect routes with middleware.
7. **Image / media pipeline** — Optimise image loading (expo-image), add video thumbnails, implement actual camera+gallery upload with progress indicators.
8. **Form validation** — Add proper field validation with error messages (email format, password rules, required fields) using a schema library like Zod.
9. **Responsive layout** — While the app targets mobile, tablet layouts (iPad split-view) and web breakpoints need attention for multi-platform deployment.
10. **Micro-interactions** — Haptic feedback on button presses (already have the component), swipe-to-dismiss on campaign cards, long-press context menus on video grid items.

## Demo Link

https://drive.google.com/file/d/1JA6MKyB3hf-NMWuPm039qA3oyHbQY7Ae/view?usp=sharing

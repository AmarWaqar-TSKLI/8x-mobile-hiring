/**
 * Step 2 — Profile Setup (avatar upload UI)
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { C } from './constants';
import { useEntrance } from './hooks';

interface Props {
  name: string;
  onNext: () => void;
}

export function StepProfile({ name, onNext }: Props) {
  const { width: screenW } = useWindowDimensions();
  const [uploaded, setUploaded] = useState(false);
  const h = useEntrance(0);
  const f = useEntrance(200);

  const initial = name?.trim()?.[0]?.toUpperCase() || '?';

  // Bounce animation on "upload"
  const bounce = useRef(new Animated.Value(1)).current;
  const handleUpload = () => {
    setUploaded(true);
    Animated.sequence([
      Animated.timing(bounce, { toValue: 1.15, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(bounce, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  // Ring pulse
  const ring = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ring, { toValue: 1, duration: 2000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.3, 0.05, 0] });

  const btnScale = useRef(new Animated.Value(1)).current;

  return (
    <View style={s.container}>
      <Animated.View style={{ opacity: h.opacity, transform: [{ translateY: h.translateY }] }}>
        <Text style={s.title}>Add a photo</Text>
        <Text style={[s.subtitle, { maxWidth: screenW * 0.8 }]}>
          Help brands recognize you. You can always change this later.
        </Text>
      </Animated.View>

      <Animated.View style={[s.avatarArea, { opacity: f.opacity, transform: [{ translateY: f.translateY }] }]}>
        {/* Pulse ring */}
        {!uploaded && (
          <Animated.View
            style={[s.avatarRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
          />
        )}

        <Pressable onPress={handleUpload}>
          <Animated.View
            style={[
              s.avatarCircle,
              uploaded && s.avatarUploaded,
              { transform: [{ scale: bounce }] },
            ]}
          >
            {uploaded ? (
              <>
                <Text style={s.avatarInitial}>{initial}</Text>
                <View style={s.uploadedBadge}>
                  <Text style={s.uploadedCheck}>✓</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={s.avatarInitial}>{initial}</Text>
                <View style={s.cameraBadge}>
                  <Text style={s.cameraIcon}>+</Text>
                </View>
              </>
            )}
          </Animated.View>
        </Pressable>

        <Text style={s.avatarName}>{name}</Text>

        {!uploaded && (
          <Pressable onPress={handleUpload} style={s.uploadBtn}>
            <Text style={s.uploadBtnText}>Choose Photo</Text>
          </Pressable>
        )}

        {uploaded && (
          <View style={s.successRow}>
            <View style={s.successBadge}>
              <Text style={s.successCheck}>✓</Text>
            </View>
            <Text style={s.successText}>Looking great!</Text>
          </View>
        )}
      </Animated.View>

      <View style={s.bottomArea}>
        <Pressable
          onPressIn={() => Animated.spring(btnScale, { toValue: 0.95, friction: 8, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
          onPress={onNext}
        >
          <Animated.View style={[s.btn, { transform: [{ scale: btnScale }] }]}>
            <Text style={s.btnText}>{uploaded ? 'Continue' : 'Skip for now'}</Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 24 },

  title: {
    fontSize: 28, fontWeight: '800', color: C.ink,
    letterSpacing: -1.5, textAlign: 'center', marginBottom: 10,
  },
  subtitle: {
    fontSize: 16, lineHeight: 24, color: C.muted,
    textAlign: 'center', marginBottom: 40,
    alignSelf: 'center',
  },

  avatarArea: { alignItems: 'center', gap: 18 },

  avatarRing: {
    position: 'absolute', top: -12, width: 144, height: 144, borderRadius: 72,
    borderWidth: 2, borderColor: C.accent,
  },
  avatarCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: C.accentBg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: C.border,
  },
  avatarUploaded: { borderColor: C.accentAlt, backgroundColor: '#E8FBF5' },
  avatarInitial: { fontSize: 42, fontWeight: '800', color: C.accent },
  uploadedBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.accentAlt, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: C.bg,
  },
  uploadedCheck: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  cameraBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: C.bg,
  },
  cameraIcon: { fontSize: 20, fontWeight: '700', color: '#FFF', marginTop: -1 },

  avatarName: { fontSize: 18, fontWeight: '700', color: C.ink, letterSpacing: -0.3, marginTop: 8 },

  uploadBtn: {
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1.5, borderColor: C.accent,
    backgroundColor: C.accentBg, marginTop: 4,
  },
  uploadBtnText: { fontSize: 15, fontWeight: '600', color: C.accent },

  successRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  successBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: C.accentAlt, alignItems: 'center', justifyContent: 'center',
  },
  successCheck: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  successText: { fontSize: 15, fontWeight: '600', color: C.accentAlt },

  bottomArea: { marginTop: 'auto', paddingBottom: 16 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.accent, paddingVertical: 18, borderRadius: 14,
    boxShadow: '0px 8px 16px rgba(99, 91, 255, 0.25)',
    elevation: 4,
  },
  btnText: { fontSize: 17, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },
});

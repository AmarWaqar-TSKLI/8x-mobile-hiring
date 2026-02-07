/**
 * UploadSheet — animated bottom sheet with Record / Library options
 *
 * Uses expo-image-picker for real camera + gallery access.
 * Includes a backdrop, spring-animated slide-up, haptic feedback.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { C } from './constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  onMediaSelected?: (uri: string, type: 'camera' | 'library') => void;
}

export function UploadSheet({ visible, onClose, onMediaSelected }: Props) {
  const slideY    = useRef(new Animated.Value(400)).current;
  const [preview, setPreview] = useState<string | null>(null);

  /* open / close animation */
  useEffect(() => {
    if (visible) {
      setPreview(null);
      Animated.spring(slideY, {
        toValue: 0, friction: 11, tension: 55,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideY, {
        toValue: 400, duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  /* ── Camera ─────────────────────────────────────────────────────────── */
  const handleCamera = useCallback(async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['videos', 'images'],
      quality: 0.8,
      videoMaxDuration: 60,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      setPreview(uri);
      onMediaSelected?.(uri, 'camera');
    }
  }, [onMediaSelected]);

  /* ── Library ────────────────────────────────────────────────────────── */
  const handleLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos', 'images'],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      setPreview(uri);
      onMediaSelected?.(uri, 'library');
    }
  }, [onMediaSelected]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop dismiss area */}
      <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.35)' }]} onPress={onClose} />

      {/* Sheet */}
      <Animated.View style={[s.sheet, { transform: [{ translateY: slideY }] }]}>
        {/* Handle */}
        <View style={s.handleRow}>
          <View style={s.handle} />
        </View>

        <Text style={s.sheetTitle}>Create New Content</Text>
        <Text style={s.sheetSub}>Choose how you'd like to add your video</Text>

        {/* Options */}
        <View style={s.optionGrid}>
          <OptionCard
            icon={<CameraIcon />}
            title="Record Video"
            subtitle="Open camera"
            color={C.accent}
            onPress={handleCamera}
          />
          <OptionCard
            icon={<GalleryIcon />}
            title="From Library"
            subtitle="Choose existing"
            color={C.accentAlt}
            onPress={handleLibrary}
          />
        </View>

        {/* Quick tips */}
        <View style={s.tipsWrap}>
          <Text style={s.tipsTitle}>Quick tips for better content</Text>
          <View style={s.tipRow}>
            <View style={s.tipDot} />
            <Text style={s.tipText}>Keep videos under 60 seconds for higher engagement</Text>
          </View>
          <View style={s.tipRow}>
            <View style={[s.tipDot, { backgroundColor: C.accentAlt }]} />
            <Text style={s.tipText}>Use natural lighting and shoot in portrait mode</Text>
          </View>
          <View style={s.tipRow}>
            <View style={[s.tipDot, { backgroundColor: C.orange }]} />
            <Text style={s.tipText}>Tag the brand campaign to boost discoverability</Text>
          </View>
        </View>

        {/* Preview (after selection) */}
        {preview && (
          <View style={s.previewWrap}>
            <Image source={{ uri: preview }} style={s.previewImage} resizeMode="cover" />
            <View style={s.previewBadge}>
              <Text style={s.previewBadgeText}>Selected</Text>
            </View>
          </View>
        )}

        {/* Cancel */}
        <Pressable style={s.cancelBtn} onPress={onClose}>
          <Text style={s.cancelText}>Cancel</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

/* ── Option card ──────────────────────────────────────────────────────── */
function OptionCard({ icon, title, subtitle, color, onPress }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPressIn={() => Animated.spring(scale, { toValue: 0.94, friction: 8, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
      onPress={onPress}
      style={{ flex: 1 }}
    >
      <Animated.View style={[s.optionCard, { transform: [{ scale }] }]}>
        <View style={[s.optionIcon, { backgroundColor: color + '18' }]}>
          {icon}
        </View>
        <Text style={s.optionTitle}>{title}</Text>
        <Text style={s.optionSub}>{subtitle}</Text>
        <View style={[s.optionArrow, { backgroundColor: color }]}>
          <View style={s.arrowChevron} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

/* ── View-based icons ─────────────────────────────────────────────────── */
function CameraIcon() {
  return (
    <View style={{ width: 28, height: 22 }}>
      <View style={{
        width: 28, height: 18, borderRadius: 6,
        backgroundColor: C.accent, position: 'absolute', bottom: 0,
      }} />
      <View style={{
        width: 14, height: 8, borderRadius: 3,
        backgroundColor: C.accent, position: 'absolute', top: 0, left: 7,
      }} />
      <View style={{
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: '#FFF', position: 'absolute', bottom: 4, left: 9,
      }} />
    </View>
  );
}

function GalleryIcon() {
  return (
    <View style={{ width: 26, height: 22 }}>
      <View style={{
        width: 26, height: 22, borderRadius: 5,
        borderWidth: 2.5, borderColor: C.accentAlt,
      }} />
      <View style={{
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: C.accentAlt,
        position: 'absolute', top: 4, left: 4,
      }} />
      <View style={{
        position: 'absolute', bottom: 3, left: 2, right: 2,
        height: 6, backgroundColor: C.accentAlt,
        borderBottomLeftRadius: 3, borderBottomRightRadius: 3,
        opacity: 0.5,
      }} />
    </View>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  backdrop: {
    display: 'none',
  },

  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: C.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 34,
    boxShadow: '0px -8px 30px rgba(0, 0, 0, 0.1)',
    elevation: 16,
  },

  handleRow: { alignItems: 'center', paddingVertical: 14 },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: C.border,
  },

  sheetTitle: {
    fontSize: 22, fontWeight: '800', color: C.ink,
    letterSpacing: -0.8, marginBottom: 4,
  },
  sheetSub: {
    fontSize: 14, color: C.muted, marginBottom: 22,
  },

  optionGrid: {
    flexDirection: 'row', gap: 12,
    marginBottom: 24,
  },

  optionCard: {
    backgroundColor: C.bg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    gap: 8,
  },
  optionIcon: {
    width: 56, height: 56, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 14, fontWeight: '800', color: C.ink,
    letterSpacing: -0.2,
  },
  optionSub: {
    fontSize: 12, color: C.muted,
  },
  optionArrow: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 4,
  },
  arrowChevron: {
    width: 8, height: 8,
    borderRightWidth: 2.5, borderBottomWidth: 2.5,
    borderColor: '#FFF',
    transform: [{ rotate: '-45deg' }],
    marginLeft: -2,
  },

  /* tips */
  tipsWrap: {
    backgroundColor: C.bg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 13, fontWeight: '700', color: C.ink,
    marginBottom: 12, letterSpacing: -0.1,
  },
  tipRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    marginBottom: 8,
  },
  tipDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: C.accent, marginTop: 5,
  },
  tipText: {
    flex: 1, fontSize: 12, lineHeight: 17, color: C.muted,
  },

  /* preview */
  previewWrap: {
    height: 120, borderRadius: 16,
    overflow: 'hidden', marginBottom: 20,
  },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  previewBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: C.accentAlt,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  previewBadgeText: {
    fontSize: 11, fontWeight: '700', color: '#FFF',
  },

  /* cancel */
  cancelBtn: {
    alignItems: 'center', paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: C.bg,
    marginBottom: 4,
  },
  cancelText: {
    fontSize: 15, fontWeight: '700', color: C.muted,
  },
});

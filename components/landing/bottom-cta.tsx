import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C } from './constants';
import { PrimaryButton } from './buttons';

export function BottomCTA({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <View style={s.bottomCta}>
      <Text style={s.bottomH2}>Ready to start earning?</Text>
      <Text style={s.bottomSub}>
        Join 12,000+ creators already building their income on 8x.
      </Text>
      <Text style={s.bottomBadge}>Limited spots this month</Text>
      <Text style={s.bottomHint}>Tap to create a free account</Text>
      <View style={s.bottomSpacer} />
      <PrimaryButton label="Create Free Account" onPress={onGetStarted} />
    </View>
  );
}

const s = StyleSheet.create({
  bottomCta: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 56,
  },
  bottomH2: { fontSize: 32, fontWeight: '800', color: C.ink, letterSpacing: -1.5, textAlign: 'center' },
  bottomSub: { fontSize: 16, lineHeight: 24, color: C.muted, marginTop: 12, textAlign: 'center', maxWidth: 320 },
  bottomBadge: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: '700',
    color: C.accent,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  bottomHint: {
    marginTop: 8,
    fontSize: 13,
    color: C.inkSoft,
  },
  bottomSpacer: {
    marginTop: 28,
  },
});

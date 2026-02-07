import React from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { C, STATS } from './constants';
import { useEntrance, useCounter } from './hooks';

function StatItem({ end, suffix, label, delay }: { end: number; suffix: string; label: string; delay: number }) {
  const count = useCounter(end, delay);
  const { opacity, translateY } = useEntrance(delay);
  return (
    <Animated.View style={[s.statItem, { opacity, transform: [{ translateY }] }]}>
      <Text style={s.statValue}>{end >= 48 ? `$${count}` : `${count}`}{suffix}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export function SocialProof() {
  const stats = useEntrance(800);

  return (
    <Animated.View style={[s.socialProof, { opacity: stats.opacity, transform: [{ translateY: stats.translateY }] }]}>
      <Text style={s.socialLabel}>Trusted by creators worldwide</Text>
      <View style={s.statsRow}>
        {STATS.map((st, i) => (
          <StatItem key={st.label} {...st} delay={1100 + i * 200} />
        ))}
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  socialProof: { paddingHorizontal: 28, paddingTop: 48, paddingBottom: 48 },
  socialLabel: { fontSize: 12, fontWeight: '600', color: C.subtle, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 34, fontWeight: '800', color: C.ink, letterSpacing: -1.5 },
  statLabel: { fontSize: 13, color: C.muted, marginTop: 4, fontWeight: '500' },
});

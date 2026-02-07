import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = {
  accent: '#635BFF',
  accentAlt: '#00D4AA',
};

const SOCIALS: { name: React.ComponentProps<typeof Ionicons>['name']; label: string }[] = [
  { name: 'logo-twitter', label: 'Twitter' },
  { name: 'logo-instagram', label: 'Instagram' },
  { name: 'logo-youtube', label: 'YouTube' },
  { name: 'logo-linkedin', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <View style={s.footer}>
      {/* Top: Brand + tagline */}
      <View style={s.topRow}>
        <View style={s.brandCol}>
          <Text style={s.logo}>8x</Text>
          <Text style={s.tagline}>
            The platform where creators{'\n'}and brands build together.
          </Text>
          <View style={s.socialRow}>
            {SOCIALS.map((item, i) => (
              <Pressable key={i} style={({ pressed }) => [s.socialCircle, pressed && s.socialPressed]}>
                <Ionicons name={item.name} size={17} color="rgba(255,255,255,0.6)" />
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Link columns */}
      <View style={s.linksGrid}>
        <View style={s.linkCol}>
          <Text style={s.colTitle}>Platform</Text>
          <Text style={s.link}>Why 8x</Text>
          <Text style={s.link}>How It Works</Text>
          <Text style={s.link}>Features</Text>
          <Text style={s.link}>Testimonials</Text>
          <Text style={s.link}>Pricing</Text>
        </View>
        <View style={s.linkCol}>
          <Text style={s.colTitle}>For Creators</Text>
          <Text style={s.link}>Browse Campaigns</Text>
          <Text style={s.link}>Creator Dashboard</Text>
          <Text style={s.link}>Payout Info</Text>
          <Text style={s.link}>Success Stories</Text>
        </View>
        <View style={s.linkCol}>
          <Text style={s.colTitle}>For Brands</Text>
          <Text style={s.link}>Post a Campaign</Text>
          <Text style={s.link}>Find Creators</Text>
          <Text style={s.link}>Brand Dashboard</Text>
          <Text style={s.link}>Case Studies</Text>
        </View>
        <View style={s.linkCol}>
          <Text style={s.colTitle}>Company</Text>
          <Text style={s.link}>About</Text>
          <Text style={s.link}>Blog</Text>
          <Text style={s.link}>Careers</Text>
          <Text style={s.link}>Contact</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={s.divider} />

      {/* Bottom bar */}
      <View style={s.bottomRow}>
        <Text style={s.copy}>© 2026 8x Inc. All rights reserved.</Text>
        <View style={s.legalRow}>
          <Text style={s.legalLink}>Privacy</Text>
          <Text style={s.dot}>·</Text>
          <Text style={s.legalLink}>Terms</Text>
          <Text style={s.dot}>·</Text>
          <Text style={s.legalLink}>Cookies</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  footer: {
    backgroundColor: '#0A0A0A',
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 28,
  },

  /* Top brand area */
  topRow: { marginBottom: 40 },
  brandCol: { gap: 12 },
  logo: {
    fontSize: 32, fontWeight: '800', color: '#FFFFFF',
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.5)',
  },
  socialRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  socialCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  socialPressed: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  /* Link columns */
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 40,
  },
  linkCol: {
    minWidth: 130,
    gap: 10,
    flexBasis: '40%',
    flexGrow: 0,
    marginBottom: 8,
  },
  colTitle: {
    fontSize: 12, fontWeight: '700', letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
    marginBottom: 4,
  },
  link: {
    fontSize: 14, color: 'rgba(255,255,255,0.45)',
    fontWeight: '500', lineHeight: 20,
  },

  /* Divider */
  divider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 24,
  },

  /* Bottom */
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  copy: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  legalRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  legalLink: { fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: '500' },
  dot: { fontSize: 12, color: 'rgba(255,255,255,0.2)' },
});

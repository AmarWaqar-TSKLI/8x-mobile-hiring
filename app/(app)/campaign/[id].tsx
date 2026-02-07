/**
 * CampaignDetail — full campaign brief with premium example-content carousel
 *
 * Dark header (black) with brand info, carousel with blue/black cards,
 * white brief section, and Apply CTA with loading state.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, Campaign, CAMPAIGNS, daysUntil, statusMeta } from '@/components/feed/constants';

/* ── Example content items (mock) ─────────────────────── */
const EXAMPLES = [
  { id: '1', label: 'Product Flat Lay', desc: 'Clean top‑down shot of the product on marble surface' },
  { id: '2', label: 'In‑Use Demo', desc: 'Show the product in real everyday use, natural lighting preferred' },
  { id: '3', label: 'Unboxing Reel', desc: '15–30s vertical reel capturing the full unboxing experience' },
  { id: '4', label: 'Lifestyle Shot', desc: 'Product styled in an aspirational lifestyle context' },
  { id: '5', label: 'Before & After', desc: 'Authentic transformation or comparison content' },
];

/* ── Carousel card ─────────────────────────────────────── */
function ExampleCard({
  item,
  index,
  scrollX,
  cardW,
}: {
  item: (typeof EXAMPLES)[number];
  index: number;
  scrollX: Animated.Value;
  cardW: number;
}) {
  const isBlack = index % 2 === 0;
  const bg = isBlack ? '#0A0A0A' : C.accent;
  const dim = isBlack ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.18)';

  const inputRange = [
    (index - 1) * cardW,
    index * cardW,
    (index + 1) * cardW,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.92, 1, 0.92],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.6, 1, 0.6],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[cs.cardWrap, { width: cardW, transform: [{ scale }], opacity }]}>
      <View style={[cs.card, { backgroundColor: bg }]}>
        {/* Large index watermark */}
        <Text style={[cs.watermark, { color: dim }]}>
          0{index + 1}
        </Text>

        <View style={cs.content}>
          <Text style={cs.label}>{item.label}</Text>
          <Text style={cs.desc}>{item.desc}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const cs = StyleSheet.create({
  cardWrap: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  card: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  watermark: {
    position: 'absolute',
    top: 16,
    right: 20,
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -4,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(255,255,255,0.72)',
  },
});

/* ── Dot indicator ─────────────────────────────────────── */
function DotIndicator({
  count,
  scrollX,
  cardW,
}: {
  count: number;
  scrollX: Animated.Value;
  cardW: number;
}) {
  return (
    <View style={di.row}>
      {Array.from({ length: count }).map((_, i) => {
        const inputRange = [
          (i - 1) * cardW,
          i * cardW,
          (i + 1) * cardW,
        ];
        const width = scrollX.interpolate({
          inputRange,
          outputRange: [6, 24, 6],
          extrapolate: 'clamp',
        });
        const bg = scrollX.interpolate({
          inputRange,
          outputRange: ['rgba(255,255,255,0.2)', '#FFFFFF', 'rgba(255,255,255,0.2)'],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={i}
            style={[di.dot, { width, backgroundColor: bg }]}
          />
        );
      })}
    </View>
  );
}

const di = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});

/* ── Back button ───────────────────────────────────────── */
function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={bb.btn} hitSlop={12}>
      <Text style={bb.label}>Go Back</Text>
    </Pressable>
  );
}

const bb = StyleSheet.create({
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});

/* ── Brief row ─────────────────────────────────────────── */
function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={br.row}>
      <Text style={br.label}>{label}</Text>
      <Text style={br.value}>{value}</Text>
    </View>
  );
}

const br = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7C93',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A2540',
  },
});

/* ═══════════════════════════════════════════════════════════
   CampaignDetailScreen
   ═══════════════════════════════════════════════════════════ */
export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();

  /* Resolve campaign */
  const campaign: Campaign | undefined = CAMPAIGNS.find((c) => c.id === id);

  /* Entrance animation */
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  /* Carousel scroll */
  const scrollX = useRef(new Animated.Value(0)).current;
  const CARD_W = screenW * 0.72;

  /* Apply button state */
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const btnScale = useRef(new Animated.Value(1)).current;
  const spinVal = useRef(new Animated.Value(0)).current;

  const spinAnim = useRef<Animated.CompositeAnimation | null>(null);

  const onApply = useCallback(() => {
    if (applying || applied) return;
    setApplying(true);
    spinAnim.current = Animated.loop(
      Animated.timing(spinVal, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spinAnim.current.start();

    setTimeout(() => {
      spinAnim.current?.stop();
      spinVal.setValue(0);
      setApplying(false);
      setApplied(true);
    }, 2000);
  }, [applying, applied]);

  const spinRotate = spinVal.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  /* Not found state */
  if (!campaign) {
    return (
      <View style={[nf.root, { paddingTop: insets.top + 16 }]}>
        <BackButton onPress={() => router.back()} />
        <View style={nf.body}>
          <View style={nf.iconWrap}>
            <Text style={nf.icon}>🔍</Text>
          </View>
          <Text style={nf.title}>Campaign not found</Text>
          <Text style={nf.sub}>
            This campaign may have been removed{'\n'}or is no longer available.
          </Text>
        </View>
      </View>
    );
  }

  const days = daysUntil(campaign.deadline);
  const meta = statusMeta(campaign.status);
  const spotsLeft = campaign.slots - campaign.applicants;
  const fillPct = Math.min(100, (campaign.applicants / campaign.slots) * 100);

  return (
    <View style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* ── Dark header ─────────────────────────────────── */}
        <Animated.View
          style={[
            s.darkHeader,
            {
              paddingTop: insets.top + 12,
              opacity: entrance,
              transform: [{
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              }],
            },
          ]}
        >
          {/* Top bar */}
          <View style={s.topBar}>
            <BackButton onPress={() => router.back()} />
            <View style={s.statusPill}>
              <View style={[s.statusDot, { backgroundColor: meta.bg === C.accent ? '#FFF' : meta.bg }]} />
              <Text style={s.statusText}>{meta.label}</Text>
            </View>
          </View>

          {/* Brand + pay */}
          <View style={s.brandSection}>
            <View style={[s.brandAvatar, { backgroundColor: campaign.brand.color }]}>
              <Text style={s.brandInitial}>{campaign.brand.initial}</Text>
            </View>
            <View style={s.brandInfo}>
              <View style={s.brandNameRow}>
                <Text style={s.brandName}>{campaign.brand.name}</Text>
                {campaign.brand.verified && (
                  <View style={s.verifiedBadge}>
                    <Text style={s.verifiedCheck}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={s.category}>{campaign.category}</Text>
            </View>
            <View style={s.payBadge}>
              <Text style={s.payAmount}>${campaign.pay}</Text>
              <Text style={s.payLabel}>payout</Text>
            </View>
          </View>

          {/* Campaign title */}
          <Text style={s.campaignTitle}>{campaign.title}</Text>

          {/* Carousel */}
          <Text style={s.carouselLabel}>Example Content</Text>
          <Animated.FlatList
            data={EXAMPLES}
            keyExtractor={(item: (typeof EXAMPLES)[number]) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_W}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: (screenW - CARD_W) / 2 - 8 }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true },
            )}
            scrollEventThrottle={16}
            renderItem={({ item, index }: { item: (typeof EXAMPLES)[number]; index: number }) => (
              <ExampleCard
                item={item}
                index={index}
                scrollX={scrollX}
                cardW={CARD_W}
              />
            )}
          />
          <DotIndicator count={EXAMPLES.length} scrollX={scrollX} cardW={CARD_W} />
        </Animated.View>

        {/* ── White brief section ─────────────────────────── */}
        <Animated.View
          style={[
            s.briefSection,
            {
              opacity: entrance,
              transform: [{
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              }],
            },
          ]}
        >
          <Text style={s.sectionTitle}>Campaign Brief</Text>
          <Text style={s.briefBody}>{campaign.description}</Text>

          <View style={s.divider} />

          <Text style={s.sectionTitle}>Details</Text>
          <BriefRow label="Deadline" value={days > 0 ? `${days} days left` : 'Expired'} />
          <BriefRow label="Applicants" value={`${campaign.applicants} / ${campaign.slots}`} />
          <BriefRow label="Spots remaining" value={spotsLeft > 0 ? `${spotsLeft}` : 'Full'} />
          <BriefRow label="Category" value={campaign.category} />
          <BriefRow label="Payout" value={`$${campaign.pay}`} />

          {/* Progress bar */}
          <View style={s.progressSection}>
            <View style={s.progressLabelRow}>
              <Text style={s.progressLabel}>Applications</Text>
              <Text style={s.progressPct}>{Math.round(fillPct)}%</Text>
            </View>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: `${fillPct}%` as any }]} />
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Sticky CTA ────────────────────────────────────── */}
      <View style={[s.ctaWrap, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          onPressIn={() =>
            Animated.spring(btnScale, { toValue: 0.96, friction: 8, useNativeDriver: true }).start()
          }
          onPressOut={() =>
            Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()
          }
          onPress={onApply}
          disabled={campaign.status === 'completed' || applied}
        >
          <Animated.View
            style={[
              s.ctaBtn,
              applied && s.ctaBtnApplied,
              campaign.status === 'completed' && { opacity: 0.5 },
              { transform: [{ scale: btnScale }] },
            ]}
          >
            {applying ? (
              <View style={s.ctaRow}>
                <Animated.View
                  style={[s.ctaSpinner, { transform: [{ rotate: spinRotate }] }]}
                />
                <Text style={[s.ctaText, applied && s.ctaTextApplied]}>Applying…</Text>
              </View>
            ) : applied ? (
              <Text style={[s.ctaText, s.ctaTextApplied]}>✓ Applied</Text>
            ) : campaign.status === 'completed' ? (
              <Text style={s.ctaText}>Campaign Ended</Text>
            ) : (
              <Text style={s.ctaText}>Apply Now — ${campaign.pay}</Text>
            )}
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

/* ── Not found styles ──────────────────────────────────── */
const nf = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 20,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: { fontSize: 32 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 10,
  },
  sub: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
});

/* ── Main styles ───────────────────────────────────────── */
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  /* Dark header */
  darkHeader: {
    backgroundColor: '#0A0A0A',
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  brandAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandInitial: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFF',
  },
  brandInfo: { flex: 1, marginLeft: 14 },
  brandNameRow: { flexDirection: 'row', alignItems: 'center' },
  brandName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  verifiedCheck: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
    marginTop: -1,
  },
  category: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },
  payBadge: {
    alignItems: 'flex-end',
  },
  payAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  payLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
  },
  campaignTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 32,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  carouselLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  /* Brief section */
  briefSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.accent,
    marginBottom: 14,
  },
  briefBody: {
    fontSize: 16,
    lineHeight: 26,
    color: '#425466',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6EBF1',
    marginVertical: 24,
  },
  progressSection: {
    marginTop: 24,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7C93',
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A2540',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E6EBF1',
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
  },

  /* Sticky CTA */
  ctaWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'rgba(250,250,250,0.96)',
    borderTopWidth: 1,
    borderTopColor: '#E6EBF1',
    zIndex: 5,
    elevation: 5,
  },
  ctaBtn: {
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  ctaBtnApplied: {
    backgroundColor: C.accent,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  ctaTextApplied: {
    color: '#FFFFFF',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ctaSpinner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderTopColor: '#FFFFFF',
  },
});

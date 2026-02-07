/**
 * PortfolioGrid — 3-column content showcase
 *
 * Features:
 * - 3-col masonry-style grid showing top content
 * - Pinned items get a small pin indicator
 * - View count + play icon overlay at bottom
 * - Duration pill at top-right
 * - Fade-in on image load for polished feel
 * - Section header with "See All" action
 */
import React, { useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { C, PORTFOLIO, formatCompact } from './constants';
import type { PortfolioItem } from './constants';

const GAP = 3;
const COLS = 3;

export function PortfolioGrid() {
  const { width: screenW } = useWindowDimensions();
  const TILE_W = (screenW - 40 - GAP * (COLS - 1)) / COLS;
  return (
    <View style={s.root}>
      {/* section header */}
      <View style={s.header}>
        <Text style={s.heading}>Portfolio</Text>
        <Pressable hitSlop={8}>
          <Text style={s.seeAll}>See All</Text>
        </Pressable>
      </View>

      {/* grid */}
      <View style={s.grid}>
        {PORTFOLIO.map((item, i) => (
          <Tile key={item.id} item={item} index={i} tileW={TILE_W} />
        ))}
      </View>
    </View>
  );
}

/* ── individual tile ──────────────────────────────────────────────────── */
function Tile({ item, index, tileW }: { item: PortfolioItem; index: number; tileW: number }) {
  const imgOp = useRef(new Animated.Value(0)).current;

  return (
    <View style={[s.tile, { width: tileW, height: tileW * 1.35 }]}>
      <Animated.Image
        source={{ uri: item.thumbnail }}
        style={[s.tileImg, { opacity: imgOp }]}
        resizeMode="cover"
        onLoad={() =>
          Animated.timing(imgOp, { toValue: 1, duration: 350, useNativeDriver: true }).start()
        }
      />

      {/* duration pill */}
      <View style={s.durationPill}>
        <Text style={s.durationText}>{item.duration}</Text>
      </View>

      {/* bottom overlay — views */}
      <View style={s.bottomOverlay}>
        <Text style={s.playIcon}>▶</Text>
        <Text style={s.viewsText}>{formatCompact(item.views)}</Text>
      </View>

      {/* pinned indicator */}
      {item.isPinned && (
        <View style={s.pinBadge}>
          <Text style={s.pinIcon}>📌</Text>
        </View>
      )}
    </View>
  );
}

/* ── styles ───────────────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  heading: {
    fontSize: 17,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.4,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
    color: C.accent,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: GAP,
  },

  tile: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: C.shimmer1,
  },
  tileImg: {
    ...StyleSheet.absoluteFillObject,
  },

  durationPill: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },

  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  playIcon: {
    fontSize: 8,
    color: '#FFF',
  },
  viewsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },

  pinBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  pinIcon: {
    fontSize: 11,
  },
});

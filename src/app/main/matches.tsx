import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { Matches, Profiles } from '@/api/requests';
import useMetromatchStore from '@/store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useMatchService from '@/hooks/services/useMatchService';

dayjs.extend(relativeTime);


interface MatchItem {
  id: string,
  profileId: string,
  name: string,
  photoUrl?: string,
  profession?: string,
  matchedAt: string,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function formatTime(dt: string | null): string {
  if (!dt) return '';
  return dayjs(dt).fromNow();
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ uri, name, size = 70 }: { uri?: string; name: string; size?: number }) {
  const [error, setError] = useState(false);
  if (uri && !error) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        onError={() => setError(true)}
      />
    );
  }
  return (
    <View style={[styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
    </View>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────────────

function MatchCard({
  item,
  onPress,
  onUnmatch,
}: {
  item: MatchItem;
  onPress: () => void;
  onUnmatch: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const name = item.name;
  const photoUrl = item.photoUrl;
  const profession = item.profession;
  const time = formatTime(item.matchedAt);

  const handleUnmatch = () => {
    Alert.alert(
      'Unmatch',
      `Are you sure you want to unmatch with ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unmatch', style: 'destructive', onPress: onUnmatch },
      ]
    );
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        {/* Avatar with glow ring */}
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <Avatar uri={photoUrl} name={name} size={62} />
            </View>
          </LinearGradient>
        </View>

        {/* Info */}
        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={1}>{name}</Text>
          {profession ? (
            <Text style={styles.cardProfession} numberOfLines={1}>{profession}</Text>
          ) : null}
          <View style={styles.cardMeta}>
            <Ionicons name="heart" size={11} color={COLORS.primaryLight} />
            <Text style={styles.cardTime}>Matched {time}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.chatBtn} onPress={onPress}>
            <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.unmatchBtn} onPress={handleUnmatch}>
            <Ionicons name="close" size={16} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name="star-outline" size={52} color="rgba(255,255,255,0.25)" />
      </View>
      <Text style={styles.emptyTitle}>No matches yet</Text>
      <Text style={styles.emptySubtitle}>
        When you and someone both like each other, they'll appear here.
      </Text>
      <TouchableOpacity style={styles.discoverBtn} onPress={() => router.push('/main/discover' as any)}>
        <Text style={styles.discoverBtnText}>Start Discovering</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function MatchesScreen() {
  const [items, setItems] = useState<MatchItem[]>([]);
  const profile = useMetromatchStore((s: any) => s.profile);
  const { getMatches, matches, isMatchesLoading } = useMatchService({});
  // const loadMatches = useCallback(async () => {
  //   try {
  //     const res = await Matches.getMatches();
  //     const matches: Match[] = res.data?.data ?? res.data ?? [];

  //     const enriched = await Promise.all(
  //       matches
  //         .filter((m) => !m.unmatchedAt)
  //         .map(async (match): Promise<MatchItem> => {
  //           const otherId = match.user1Id === profile?.userId ? match.user2Id : match.user1Id;
  //           let otherProfile: Profile | null = null;
  //           try {
  //             const pRes = await Profiles.getProfiles('', { userId: otherId });
  //             const data = pRes.data?.data ?? pRes.data;
  //             if (Array.isArray(data)) {
  //               otherProfile = data.find((p: Profile) => p.userId === otherId) ?? null;
  //             } else {
  //               otherProfile = data ?? null;
  //             }
  //           } catch {
  //             // leave null
  //           }
  //           return { match, profile: otherProfile };
  //         })
  //     );

  //     // Sort by most recently matched
  //     enriched.sort((a, b) =>
  //       dayjs(b.match.matchedAt).unix() - dayjs(a.match.matchedAt).unix()
  //     );

  //     setItems(enriched);
  //   } catch {
  //     // silently ignore
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // }, [profile?.userId]);

  useEffect(() => {
    getMatches();
  }, []);

  const onRefresh = () => {
    getMatches();
  };

  const handleUnmatch = async (matchId: string) => {
    try {
      await Matches.unmatch(matchId);
      setItems((prev) => prev.filter((i) => i.id !== matchId));
    } catch {
      // error toast is handled by http interceptor
    }
  };
  console.log('matches', matches)
  return (
    <LinearGradient
      colors={[COLORS.backgroundStart, COLORS.backgroundMiddle, COLORS.backgroundEnd]}
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Matches</Text>
          {matches?.length > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{matches.length}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        {isMatchesLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={COLORS.primaryLight} />
          </View>
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MatchCard
                item={item}
                onPress={() => router.push(`/main/chat/${item.profileId}` as any)}
                onUnmatch={() => handleUnmatch(item.id)}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={<EmptyState />}
            contentContainerStyle={[styles.list, items.length === 0 && styles.listEmpty]}
            refreshControl={
              <RefreshControl
                refreshing={isMatchesLoading}
                onRefresh={onRefresh}
                tintColor={COLORS.primaryLight}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red'
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: TYPOGRAPHY.bold,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 11,
    fontFamily: TYPOGRAPHY.bold,
  },

  // List
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  listEmpty: {
    flex: 1,
    // justifyContent: 'center',
  },
  separator: {
    height: 10,
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    gap: 14,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    overflow: 'hidden',
    backgroundColor: 'rgba(7,28,107,0.9)',
  },
  avatarFallback: {
    backgroundColor: 'rgba(47,107,255,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: 'white',
    fontFamily: TYPOGRAPHY.bold,
    fontSize: 22,
  },
  cardContent: {
    flex: 1,
    gap: 3,
  },
  cardName: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.semibold,
    color: '#FFFFFF',
  },
  cardProfession: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.regular,
    color: 'rgba(255,255,255,0.55)',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  cardTime: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.regular,
    color: 'rgba(255,255,255,0.4)',
  },
  cardActions: {
    alignItems: 'center',
    gap: 8,
  },
  chatBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unmatchBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loading
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty
  empty: {
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.semibold,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.regular,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 22,
  },
  discoverBtn: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  discoverBtnText: {
    color: '#fff',
    fontFamily: TYPOGRAPHY.semibold,
    fontSize: 14,
  },
});

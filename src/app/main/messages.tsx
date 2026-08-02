import React, { useEffect, useState, useCallback, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { Matches, Profiles, Chat } from '@/api/requests';
import useMetromatchStore from '@/store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  matchedAt: string;
  lastMessageAt: string | null;
}

interface Profile {
  id?: string;
  userId: string;
  name: string;
  dob?: string;
  profession?: string;
  photos?: { url: string }[];
}

interface ConversationItem {
  match: Match;
  profile: Profile | null;
  lastMessage: string | null;
  unread: boolean;
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
  return dayjs(dt).fromNow(true);
}

// ─── AvatarPlaceholder ────────────────────────────────────────────────────────

function Avatar({ uri, name, size = 52 }: { uri?: string; name: string; size?: number }) {
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

// ─── Conversation Row ─────────────────────────────────────────────────────────

function ConversationRow({ item, onPress }: { item: ConversationItem; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const name = item.match.profile?.name ?? 'Matched User';
  const photoUrl = item.profile?.photos?.[0]?.url;
  const time = formatTime(item.match.lastMessageAt ?? item.match.matchedAt);
  const preview = item.lastMessage ?? 'Start a conversation ✨';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.row}
      >
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Avatar uri={photoUrl} name={name} size={54} />
          <View style={styles.onlineDot} />
        </View>

        {/* Text */}
        <View style={styles.rowContent}>
          <View style={styles.rowHeader}>
            <Text style={styles.rowName} numberOfLines={1}>{name}</Text>
            <Text style={styles.rowTime}>{time}</Text>
          </View>
          <Text
            style={[styles.rowPreview, item.unread && styles.rowPreviewBold]}
            numberOfLines={1}
          >
            {preview}
          </Text>
        </View>

        {/* Unread pip */}
        {item.unread && <View style={styles.unreadPip} />}

        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" style={{ marginLeft: 4 }} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name="chatbubble-ellipses-outline" size={52} color="rgba(255,255,255,0.25)" />
      </View>
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptySubtitle}>
        When you match with someone, your conversations will appear here.
      </Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function MessagesScreen() {
  const [items, setItems] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const profile = useMetromatchStore((s: any) => s.profile);

  const loadConversations = useCallback(async () => {
    try {
      const matchesRes = await Matches.getMatches();
      const matches: Match[] = matchesRes.data?.data ?? matchesRes.data ?? [];

      // For each match, load the other user's profile + last message in parallel
      const enriched = await Promise.all(
        matches.map(async (match): Promise<ConversationItem> => {
          const otherId =
            match.user1Id === profile.id ? match.user2Id : match.user1Id;

          let otherProfile: Profile | null = null;
          let lastMessage: string | null = null;

          try {
            const pRes = await Profiles.getProfiles('', { userId: otherId });
            const profileData = pRes.data?.data ?? pRes.data;
            if (Array.isArray(profileData)) {
              otherProfile = profileData.find((p: Profile) => p.userId === otherId) ?? null;
            } else {
              otherProfile = profileData ?? null;
            }
          } catch {
            // profile not found — leave null
          }

          try {
            const msgRes = await Chat.getMessages(match.id, { pageSize: 1, order: 'desc' });
            const msgs = msgRes.data?.data ?? msgRes.data ?? [];
            if (msgs.length > 0) {
              lastMessage = msgs[0].body;
            }
          } catch {
            // no messages yet
          }

          return {
            match,
            profile: otherProfile,
            lastMessage,
            unread: false,
          };
        }),
      );
      console.log('enriched', enriched)

      // Sort by most recent activity
      enriched.sort((a, b) => {
        const aTime = a.match.lastMessageAt ?? a.match.matchedAt;
        const bTime = b.match.lastMessageAt ?? b.match.matchedAt;
        return dayjs(bTime).unix() - dayjs(aTime).unix();
      });

      setItems(enriched);
    } catch (err) {
      // silently ignore — no toast on background refresh
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profile.id]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const onRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  return (
    <LinearGradient
      colors={[COLORS.backgroundStart, COLORS.backgroundMiddle, COLORS.backgroundEnd]}
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* ── Header ───────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{items.length}</Text>
          </View>
        </View>

        {/* ── Content ──────────────────────────────────────────────────── */}
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={COLORS.primaryLight} />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.match.id}
            renderItem={({ item }) => (
              <ConversationRow
                item={item}
                onPress={() => router.push(`/main/chat/${item.match.id}` as any)}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={<EmptyState />}
            contentContainerStyle={[styles.list, items.length === 0 && styles.listEmpty]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
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
    justifyContent: 'center',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarFallback: {
    backgroundColor: 'rgba(47,107,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: 'white',
    fontFamily: TYPOGRAPHY.bold,
    fontSize: 18,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: 'rgba(7,28,107,0.9)',
  },
  rowContent: {
    flex: 1,
    gap: 3,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowName: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.semibold,
    color: '#FFFFFF',
    flex: 1,
  },
  rowTime: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.regular,
    color: 'rgba(255,255,255,0.45)',
    marginLeft: 8,
  },
  rowPreview: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.regular,
    color: 'rgba(255,255,255,0.55)',
  },
  rowPreviewBold: {
    fontFamily: TYPOGRAPHY.semibold,
    color: 'rgba(255,255,255,0.85)',
  },
  unreadPip: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  // Separator
  separator: {
    height: 8,
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
});

// import React from 'react'
// import { View } from 'react-native'

// const MessagesScreen = () => {
//   return (
//     <View></View>
//   )
// }

// export default MessagesScreen

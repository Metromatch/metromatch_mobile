import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { Chat, Matches, Profiles } from '@/api/requests';
import useMetromatchStore from '@/store';
import dayjs from 'dayjs';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  sid: string;
  author: string;
  body: string;
  dateCreated: string;
  index: number;
  _optimistic?: boolean;
}

interface Profile {
  userId: string;
  name: string;
  photos?: { url: string }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ uri, name, size = 36 }: { uri?: string; name: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (uri && !err) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(47,107,255,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'white', fontFamily: TYPOGRAPHY.bold, fontSize: size * 0.36 }}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────

function Bubble({
  message,
  isMine,
  otherName,
  otherPhotoUrl,
  showAvatar,
}: {
  message: Message;
  isMine: boolean;
  otherName: string;
  otherPhotoUrl?: string;
  showAvatar: boolean;
}) {
  const opacity = useRef(new Animated.Value(message._optimistic ? 0.6 : 1)).current;

  useEffect(() => {
    if (!message._optimistic) {
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [message._optimistic]);

  const time = dayjs(message.dateCreated).format('HH:mm');

  return (
    <Animated.View
      style={[
        styles.bubbleRow,
        isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs,
        { opacity },
      ]}
    >
      {/* Other user avatar (left side) */}
      {!isMine && (
        <View style={styles.bubbleAvatar}>
          {showAvatar ? (
            <Avatar uri={otherPhotoUrl} name={otherName} size={32} />
          ) : (
            <View style={{ width: 32 }} />
          )}
        </View>
      )}

      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[styles.bubbleText, isMine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
          {message.body}
        </Text>
        <Text
          style={[styles.bubbleTime, isMine ? styles.bubbleTimeMine : styles.bubbleTimeTheirs]}
        >
          {time}
          {isMine && (
            <Text style={styles.bubbleTick}>
              {message._optimistic ? '  ●' : '  ✓✓'}
            </Text>
          )}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function ChatRoomScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const profile = useMetromatchStore((s: any) => s.profile);
  const myId: string = profile.id ?? '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestIndexRef = useRef<number>(-1);
  const flatListRef = useRef<FlatList>(null);

  // ── Load initial data ──────────────────────────────────────────────────────

  const loadOtherProfile = useCallback(async () => {
    if (!matchId) return;
    try {
      const matchRes = await Matches.getMatchById(matchId);
      const match = matchRes.data?.data ?? matchRes.data;
      if (!match) return;

      const otherId = match.user1Id === myId ? match.user2Id : match.user1Id;

      try {
        const pRes = await Profiles.getProfiles('', { userId: otherId });
        const data = pRes.data?.data ?? pRes.data;
        if (Array.isArray(data)) {
          setOtherProfile(data.find((p: Profile) => p.userId === otherId) ?? null);
        } else {
          setOtherProfile(data ?? null);
        }
      } catch {
        /* profile not found */
      }
    } catch {
      /* match not found */
    }
  }, [matchId, myId]);

  const fetchMessages = useCallback(async (initial = false) => {
    if (!matchId) return;
    try {
      const res = await Chat.getMessages(matchId, { pageSize: 100, order: 'asc' });
      const msgs: Message[] = res.data?.data ?? res.data ?? [];

      if (initial) {
        setMessages(msgs);
        if (msgs.length > 0) {
          latestIndexRef.current = msgs[msgs.length - 1].index;
        }
      } else {
        // Only append genuinely new messages (index > last known)
        const newMsgs = msgs.filter((m) => m.index > latestIndexRef.current);
        if (newMsgs.length > 0) {
          latestIndexRef.current = newMsgs[newMsgs.length - 1].index;
          setMessages((prev) => {
            // Remove optimistic duplicates by body+author, then append
            const deduped = prev.filter((p) => !p._optimistic);
            return [...deduped, ...newMsgs];
          });
        }
      }
    } catch {
      /* ignore polling errors */
    } finally {
      if (initial) setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    loadOtherProfile();
    fetchMessages(true);

    // Poll for new messages every 3 seconds
    pollingRef.current = setInterval(() => fetchMessages(false), 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [loadOtherProfile, fetchMessages]);

  // ── Send message ───────────────────────────────────────────────────────────

  const handleSend = async () => {
    const body = inputText.trim();
    if (!body || sending || !matchId) return;

    setSending(true);
    setInputText('');

    // Optimistic UI
    const optimisticMsg: Message = {
      sid: `opt-${Date.now()}`,
      author: myId,
      body,
      dateCreated: new Date().toISOString(),
      index: latestIndexRef.current + 1,
      _optimistic: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await Chat.sendMessage(matchId, body);
      // Next poll cycle will replace the optimistic message with the real one
    } catch {
      // Remove optimistic on failure
      setMessages((prev) => prev.filter((m) => m.sid !== optimisticMsg.sid));
      setInputText(body); // restore input
    } finally {
      setSending(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const otherName = otherProfile?.name ?? 'Matched User';
  const otherPhotoUrl = otherProfile?.photos?.[0]?.url;

  return (
    <LinearGradient
      colors={[COLORS.backgroundStart, COLORS.backgroundMiddle, COLORS.backgroundEnd]}
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>

          <View style={styles.headerAvatar}>
            <Avatar uri={otherPhotoUrl} name={otherName} size={40} />
            <View style={styles.headerOnlineDot} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>{otherName}</Text>
            <Text style={styles.headerStatus}>Online now</Text>
          </View>

          <TouchableOpacity style={styles.headerAction} hitSlop={12}>
            <Ionicons name="ellipsis-vertical" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <View style={styles.divider} />

        {/* ── Messages ────────────────────────────────────────────────── */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.primaryLight} />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(m) => m.sid}
              renderItem={({ item, index }) => {
                const isMine = item.author === myId;
                const prevMsg = messages[index - 1];
                const showAvatar = !isMine && (prevMsg?.author !== item.author);
                return (
                  <Bubble
                    message={item}
                    isMine={isMine}
                    otherName={otherName}
                    otherPhotoUrl={otherPhotoUrl}
                    showAvatar={showAvatar}
                  />
                );
              }}
              contentContainerStyle={styles.messageList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyChat}>
                  <Text style={styles.emptyChatEmoji}>💬</Text>
                  <Text style={styles.emptyChatText}>Say hi to {otherName}!</Text>
                </View>
              }
            />
          )}

          {/* ── Input Bar ────────────────────────────────────────────── */}
          <View style={styles.inputBar}>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Type a message…"
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1600}
                returnKeyType="default"
              />
            </View>

            <TouchableOpacity
              style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || sending}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6EA8FF', COLORS.primary]}
                style={styles.sendBtnGradient}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="send" size={18} color="white" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerAvatar: {
    position: 'relative',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: 'rgba(7,28,107,0.9)',
  },
  headerInfo: {
    flex: 1,
    gap: 1,
  },
  headerName: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.semibold,
    color: '#FFFFFF',
  },
  headerStatus: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.regular,
    color: '#22C55E',
  },
  headerAction: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
  },

  // Message list
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
    gap: 4,
  },

  // Bubble row
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 2,
  },
  bubbleRowMine: {
    justifyContent: 'flex-end',
  },
  bubbleRowTheirs: {
    justifyContent: 'flex-start',
  },
  bubbleAvatar: {
    marginRight: 8,
    marginBottom: 4,
  },

  // Bubble
  bubble: {
    maxWidth: '72%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 3,
  },
  bubbleMine: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextMine: {
    fontFamily: TYPOGRAPHY.regular,
    color: '#FFFFFF',
  },
  bubbleTextTheirs: {
    fontFamily: TYPOGRAPHY.regular,
    color: 'rgba(255,255,255,0.9)',
  },
  bubbleTime: {
    fontSize: 10,
    fontFamily: TYPOGRAPHY.regular,
    alignSelf: 'flex-end',
  },
  bubbleTimeMine: {
    color: 'rgba(255,255,255,0.55)',
  },
  bubbleTimeTheirs: {
    color: 'rgba(255,255,255,0.4)',
  },
  bubbleTick: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.55)',
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 16 : 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(7,28,107,0.4)',
  },
  inputWrap: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.regular,
    color: '#FFFFFF',
    padding: 0,
    margin: 0,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
  sendBtnGradient: {
    flex: 1,
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
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyChatEmoji: {
    fontSize: 52,
  },
  emptyChatText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.medium,
    color: 'rgba(255,255,255,0.55)',
  },
});

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {

  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
// import {
//   Chat,
//   Channel,
//   MessageList,
//   MessageComposer,
//   OverlayProvider,
// } from 'stream-chat-expo';

// ─── Constants ────────────────────────────────────────────────────────────────

const STREAM_API_KEY = 'yfdmppzhdbdx';

export default function ChatRoomScreen() {
  const { chatToken } = useLocalSearchParams<{ chatToken: string }>();

  const init = useCallback(async () => {

  }, []);

  useEffect(() => {
    init();

    return () => {

    };
  }, [init]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <LinearGradient
      colors={[COLORS.backgroundStart, COLORS.backgroundMiddle, COLORS.backgroundEnd]}
      style={StyleSheet.absoluteFill}
    >

    </LinearGradient>
  );
}

// ─── Stream Theme Override ─────────────────────────────────────────────────────

const streamTheme = {
  messageList: {
    container: {
      backgroundColor: 'transparent',
    },
  },
  messageInput: {
    container: {
      backgroundColor: 'rgba(7,28,107,0.4)',
      borderTopColor: 'rgba(255,255,255,0.1)',
    },
    inputBox: {
      color: '#FFFFFF',
    },
    sendButton: {},
  },
  message: {
    content: {
      container: {},
    },
  },
};

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
  headerAction: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
  },

  // Chat area
  messageListContainer: {
    flex: 1,
  },

  // States
  centeredWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.regular,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.regular,
    color: 'rgba(255,100,100,0.9)',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.semibold,
    color: '#FFFFFF',
  },
});

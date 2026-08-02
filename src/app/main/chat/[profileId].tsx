// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import {
//   View, Text,
//   StyleSheet,
//   ActivityIndicator,
//   Pressable,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useLocalSearchParams, router } from 'expo-router';
// import { COLORS, TYPOGRAPHY } from '@/constants/theme';
// import AppContainer from '@/components/shared/layout/app_container';
// import { GiftedChat } from 'react-native-gifted-chat';
// import { Client } from '@twilio/conversations';
// import useProfileService from '@/hooks/services/useProfileService';
// import useChatService from '@/hooks/services/useChatService copy';
// import { AntDesign } from '@expo/vector-icons';

// export default function ChatRoomScreen() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeConversation, setActiveConversation] = useState<any>(null);
//   const { profileId } = useLocalSearchParams<{ profileId: string }>();

//   const { myProfile, isMyProfileLoading } = useProfileService({ fetchMyProfile: true })
//   const { getTwillioChatToken } = useChatService({});

//   const MY_USER_ID = 'user_1' || myProfile?.profile?.id?.slice(-12);
//   const RECIPIENT_USER_ID = 'user_2' || profileId?.slice(-12);

//   useEffect(() => {
//     // Don't run until we have both user IDs
//     if (!MY_USER_ID || !RECIPIENT_USER_ID) return;

//     console.log('Initializing chat for', MY_USER_ID, '->', RECIPIENT_USER_ID);

//     async function initializePrivateChat() {
//       try {
//         // 1. Fetch Twilio token for the current user
//         const token = await getTwillioChatToken(MY_USER_ID);
//         // Use Client.create() — NOT new Client() — so we wait for full SDK init before proceeding
//         const twilioClient = await Client.create(token);

//         // 2. Sorted room name — always the same regardless of who opens first
//         const sortedIds = [MY_USER_ID, RECIPIENT_USER_ID].sort();
//         const uniqueRoomName = `room_${sortedIds[0]}_${sortedIds[1]}`;

//         // 3. Get or create the conversation
//         let conversation;
//         try {
//           conversation = await twilioClient.getConversationByUniqueName(uniqueRoomName);
//           console.log('Fetched existing conversation:', uniqueRoomName);
//         } catch {
//           try {
//             conversation = await twilioClient.createConversation({ uniqueName: uniqueRoomName });
//             console.log('Created new conversation:', uniqueRoomName);
//           } catch (createError: any) {
//             // Conflict = the other user already created the room.
//             // We can't getConversationByUniqueName yet because we're not a participant.
//             // We'll join after this block.
//             if (createError?.message?.includes('Conflict') || createError?.status === 409) {
//               console.log('Conflict — room exists, re-fetching after join attempt...');
//               // Force-fetch via REST (works even if not a participant yet in some SDK versions)
//               conversation = await twilioClient.getConversationByUniqueName(uniqueRoomName);
//             } else {
//               throw createError;
//             }
//           }
//         }

//         // 4. Always ensure current user is a participant (runs for every code path above)
//         const participants = await conversation.getParticipants();
//         const amIParticipant = participants.some((p: any) => p.identity === MY_USER_ID);
//         if (!amIParticipant) {
//           try {
//             await conversation.join();
//             console.log(`${MY_USER_ID} joined the conversation.`);
//           } catch (joinError: any) {
//             console.log('Join error (safe):', joinError.message);
//           }
//         }

//         // 5. Always ensure recipient is a participant
//         const refreshedParticipants = await conversation.getParticipants();
//         const isRecipientIn = refreshedParticipants.some((p: any) => p.identity === RECIPIENT_USER_ID);
//         if (!isRecipientIn) {
//           try {
//             await conversation.add(RECIPIENT_USER_ID);
//             console.log(`Added ${RECIPIENT_USER_ID} to conversation.`);
//           } catch (addError: any) {
//             console.log('Add recipient error (safe):', addError.message);
//           }
//         }

//         setActiveConversation(conversation);

//         // 6. Load message history
//         const twilioMessagesPage = await conversation.getMessages();
//         const formattedHistory = twilioMessagesPage.items.map((msg: any) => ({
//           _id: msg.sid,
//           text: msg.body,
//           createdAt: msg.dateCreated,
//           user: { _id: msg.author, name: msg.author },
//         })).reverse();

//         setMessages(formattedHistory);
//         setLoading(false);

//         // 7. Live listener for incoming messages
//         conversation.on('messageAdded', (msg: any) => {
//           if (msg.author !== MY_USER_ID) {
//             const incomingMsg = {
//               _id: msg.sid,
//               text: msg.body,
//               createdAt: msg.dateCreated,
//               user: { _id: msg.author, name: msg.author },
//             };
//             setMessages((prev) => GiftedChat.append(prev, [incomingMsg]));
//           }
//         });

//       } catch (error) {
//         console.error('Twilio Private Chat init failed:', error);
//         setLoading(false);
//       }
//     }

//     initializePrivateChat();
//   }, [MY_USER_ID, RECIPIENT_USER_ID]);

//   const onSend = useCallback(async (newMessages = []) => {
//     if (!activeConversation) return;
//     setMessages((prev) => GiftedChat.append(prev, newMessages));
//     await activeConversation.sendMessage(newMessages[0].text);
//   }, [activeConversation]);

//   if (loading || isMyProfileLoading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <AppContainer includeBgImage >
//       <View style={styles.header}>
//         <Pressable onPress={() => router.back()}>
//           <Text style={styles.headerText}>Chatting with: {RECIPIENT_USER_ID}</Text>
//         </Pressable>
//       </View>
//       <GiftedChat
//         messages={messages}
//         onSend={(msgs) => onSend(msgs)}
//         user={{ _id: MY_USER_ID, name: MY_USER_ID }}
//       />
//       <View style={{ paddingBottom: 100 }} />
//     </AppContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#ffffff', paddingBottom: 100 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: { padding: 16, backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#ddd', alignItems: 'center' },
//   headerText: { fontWeight: 'bold', fontSize: 16 }
// });


// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import {
//   View, Text,
//   StyleSheet,
//   ActivityIndicator,
//   Pressable,
// } from 'react-native';

// import { useLocalSearchParams, router } from 'expo-router';
// import AppContainer from '@/components/shared/layout/app_container';
// import { GiftedChat } from 'react-native-gifted-chat';
// import { Client } from '@twilio/conversations';
// import useProfileService from '@/hooks/services/useProfileService';
// import useChatService from '@/hooks/services/useChatService copy';


// export default function ChatRoomScreen() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeConversation, setActiveConversation] = useState<any>(null);
//   const { profileId } = useLocalSearchParams<{ profileId: string }>();

//   const { myProfile, isMyProfileLoading } = useProfileService({ fetchMyProfile: true })
//   const { getTwillioChatToken } = useChatService({});

//   const MY_USER_ID = profileId?.slice(-12);
//   const RECIPIENT_USER_ID = myProfile?.profile?.id?.slice(-12);

//   useEffect(() => {
//     // Don't initialize until both user IDs are resolved
//     if (!MY_USER_ID || !RECIPIENT_USER_ID) return;

//     let twilioClient: any = null;
//     let isMounted = true;

//     async function startChatPipeline() {
//       try {
//         // 1. Fetch the secure Access Token from your private NestJS Server
//         const data = await getTwillioChatToken({ identity: MY_USER_ID, recipientId: RECIPIENT_USER_ID });

//         if (!data?.token || !data?.conversationSid) {
//           console.error("Initialization metadata missing from backend response.");
//           if (isMounted) setLoading(false);
//           return;
//         }

//         twilioClient = new Client(data.token);

//         // 2. Wait for client to initialize successfully
//         twilioClient.on('initialized', async () => {
//           if (!isMounted) return;
//           try {
//             const conversation = await twilioClient.getConversationBySid(data.conversationSid);
//             if (isMounted) setActiveConversation(conversation);

//             // Fetch chat history
//             const twilioMessagesPage = await conversation.getMessages(30);
//             const formattedHistory = twilioMessagesPage.items.map((msg: any) => ({
//               _id: msg.sid,
//               text: msg.body,
//               createdAt: msg.dateCreated,
//               user: { _id: msg.author, name: msg.author },
//             })).reverse();

//             if (isMounted) {
//               setMessages(formattedHistory);
//               setLoading(false);
//             }

//             // Listen for incoming live messages
//             conversation.on('messageAdded', (msg: any) => {
//               if (!isMounted || msg.author === MY_USER_ID) return;
//               const incomingMsg = {
//                 _id: msg.sid,
//                 text: msg.body,
//                 createdAt: msg.dateCreated,
//                 user: { _id: msg.author, name: msg.author },
//               };
//               setMessages((prev: any) => GiftedChat.append(prev, [incomingMsg]));
//             });

//           } catch (roomError) {
//             console.error("Error accessing room:", roomError);
//             if (isMounted) setLoading(false);
//           }
//         });

//         twilioClient.on('initFailed', ({ error }: any) => {
//           console.error("Twilio client init failed:", error);
//           if (isMounted) setLoading(false);
//         });

//       } catch (err: any) {
//         console.error("Pipeline failure:", err.message);
//         if (isMounted) setLoading(false);
//       }
//     }

//     startChatPipeline();

//     return () => {
//       isMounted = false;
//       if (twilioClient) {
//         twilioClient.removeAllListeners();
//       }
//     };
//   }, [MY_USER_ID, RECIPIENT_USER_ID]);

//   const onSend = useCallback(async (newMessages = []) => {
//     if (!activeConversation) return;
//     setMessages((prev) => GiftedChat.append(prev, newMessages));
//     await activeConversation.sendMessage(newMessages[0].text);
//   }, [activeConversation]);

//   if (loading || isMyProfileLoading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (

//     <AppContainer includeBgImage >
//       <View style={styles.header}>
//         <Pressable onPress={() => router.back()}>
//           <Text style={styles.headerText}>Chatting with: {RECIPIENT_USER_ID}</Text>
//         </Pressable>
//       </View>
//       <GiftedChat
//         messages={messages}
//         onSend={(msgs) => onSend(msgs)}
//         user={{ _id: MY_USER_ID, name: MY_USER_ID }}
//       />
//       <View style={{ paddingBottom: 100 }} />
//     </AppContainer>

//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#ffffff', paddingBottom: 100 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: { padding: 16, backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#ddd', alignItems: 'center' },
//   headerText: { fontWeight: 'bold', fontSize: 16 }
// });

import React from 'react'
import { View } from 'react-native'

const CharRoomScreem = () => {
  return (
    <View></View>
  )
}

export default CharRoomScreem
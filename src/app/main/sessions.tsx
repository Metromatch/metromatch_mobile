import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SessionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Likes</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
});
// import React, { useState, useEffect, useCallback } from 'react';
// import { View, StyleSheet, SafeAreaView, ActivityIndicator, Text } from 'react-native';
// import { GiftedChat } from 'react-native-gifted-chat';
// import { Client } from '@twilio/conversations';
// import useChatService from '@/hooks/services/useChatService copy';

// const NESTJS_SERVER_URL = 'http://localhost:3000';

// // SIMULATED USER CONFIGURATION (Replace with your app's actual state/routing data)
// const MY_USER_ID = 'user_alice_123';
// const RECIPIENT_USER_ID = 'user_bob_456';

// // const MY_USER_ID = 'user_bob_456';
// // const RECIPIENT_USER_ID = 'user_alice_123';

// export default function PrivateChatScreen() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeConversation, setActiveConversation] = useState<any>(null);
//   const { getTwillioChatToken } = useChatService({});

//   useEffect(() => {
//     async function initializePrivateChat() {
//       try {
//         // 1. Fetch token for the CURRENT logged-in user
//         // const response = await fetch(`${NESTJS_SERVER_URL}/chat/twilliotoken?identity=${MY_USER_ID}`);
//         const token = await getTwillioChatToken(MY_USER_ID);

//         const twilioClient = new Client(token);

//         // 2. Generate a unique, repeatable room ID for these two specific users
//         // Sorting alphabetically ensures room name is ALWAYS the same: "user_alice_123_user_bob_456"
//         const sortedIds = [MY_USER_ID, RECIPIENT_USER_ID].sort();
//         const uniqueRoomName = `room_${sortedIds[0]}_${sortedIds[1]}`;

//         let conversation;
//         try {
//           // Try to fetch the private room if it already exists on Twilio cloud
//           conversation = await twilioClient.getConversationByUniqueName(uniqueRoomName);
//         } catch {
//           // If this is their first time talking, create the private room cloud container
//           conversation = await twilioClient.createConversation({ uniqueName: uniqueRoomName });
//           await conversation.join(); // Add myself (Alice) to the room

//           try {
//             // Add the other user (Bob) to the room automatically so they can see it
//             await conversation.add(RECIPIENT_USER_ID);
//           } catch (e) {
//             console.log("Recipient might already be a participant:", e.message);
//           }
//         }

//         setActiveConversation(conversation);

//         // 3. Load private message history between these two users
//         const twilioMessagesPage = await conversation.getMessages();
//         const formattedHistory = twilioMessagesPage.items.map((msg) => ({
//           _id: msg.sid,
//           text: msg.body,
//           createdAt: msg.dateCreated,
//           user: { _id: msg.author, name: msg.author },
//         })).reverse();

//         setMessages(formattedHistory);
//         setLoading(false);

//         // 4. Listen live for new incoming messages from the recipient
//         conversation.on('messageAdded', (msg) => {
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
//   }, []);

//   const onSend = useCallback(async (newMessages = []) => {
//     if (!activeConversation) return;
//     setMessages((prev) => GiftedChat.append(prev, newMessages));

//     // Twilio saves this directly under the unique room, so only these 2 users can see it [1, 2]
//     await activeConversation.sendMessage(newMessages[0].text);
//   }, [activeConversation]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Chatting with: {RECIPIENT_USER_ID}</Text>
//       </View>
//       <GiftedChat
//         messages={messages}
//         onSend={(msgs) => onSend(msgs)}
//         user={{ _id: MY_USER_ID, name: MY_USER_ID }}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#ffffff', paddingBottom: 100 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: { padding: 16, backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#ddd', alignItems: 'center' },
//   headerText: { fontWeight: 'bold', fontSize: 16 }
// });



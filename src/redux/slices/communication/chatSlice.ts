import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import chatService from "services/chatService";

// Individual message structure
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

// Chat conversation structure
export interface ChatMessage {
  id: string; // Unique chat ID
  buyerName: string; // Name of the buyer
  lastMessage: string; // Last message in the conversation
  isRead: boolean; // Whether the chat is marked as read
  messages: Message[]; // List of messages in the chat
}

interface TypingStatus {
  [chatId: string]: boolean;
}

// Call-related state
interface CallState {
  activeCallId: string | null; // ID of the current call
  callStatus: "idle" | "ringing" | "in-progress" | "ended"; // Call status
  callParticipants: Record<string, string[]>; // Participants in the call
  callError: string | null; // Error related to calls
}

// Chat-related state
interface ChatState extends CallState {
  messages: Record<string, Message[]>; 
  callStatus: "idle" | "ringing" | "in-progress" | "ended";
  chats: Record<string, ChatMessage>; // Conversations mapped by chat ID
  activeChatId: string | null; // Currently active chat ID
  loading: boolean; // Loading indicator
  error: string | null; // Error message, if any
  typingStatus: TypingStatus; // Typing status for each chat
  readReceipts: Record<string, boolean>; // Read receipts for chats
}

// Initial state
const initialState: ChatState = {
  messages: {},
  chats: {},
  activeChatId: null,
  loading: false,
  error: null,
  typingStatus: {},
  readReceipts: {},
  activeCallId: null,
  callStatus: "idle",
  callParticipants: {},
  callError: null,
};

// Async Thunks

// Start a call
export const startCall = createAsyncThunk(
  "chat/startCall",
  async (
    { participants, callId }: { participants: string[]; callId?: string },
    { rejectWithValue }
  ) => {
    try {
      return await chatService.startCall(participants, { chatId: callId });
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to start call");
    }
  }
);

// End a call
export const endCall = createAsyncThunk(
  "chat/endCall",
  async (callId: string, { rejectWithValue }) => {
    try {
      return await chatService.endCall(callId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch messages for a specific chat
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const messages = await chatService.getMessages(chatId);
      return { chatId, messages };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch messages");
    }
  }
);

// Send a new message in a chat
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { chatId, message }: { chatId: string; message: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await chatService.postMessage(chatId, message);
      return { chatId, message: response };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to send message");
    }
  }
);

// Chat Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCallStatus: (state, action: PayloadAction<"idle" | "ringing" | "in-progress" | "ended">) => {
      state.callStatus = action.payload;
    },
    setCallError: (state, action: PayloadAction<string | null>) => {
      state.callError = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatId = action.payload;
    },
    setTypingStatus: (state, action: PayloadAction<{ chatId: string; typing: boolean }>) => {
      state.typingStatus[action.payload.chatId] = action.payload.typing;
    },
    setReadReceipt: (state, action: PayloadAction<{ chatId: string; read: boolean }>) => {
      state.readReceipts[action.payload.chatId] = action.payload.read;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Call
      .addCase(startCall.pending, (state) => {
        state.callStatus = "ringing";
        state.callError = null;
      })
      .addCase(startCall.fulfilled, (state, action) => {
        state.activeCallId = action.payload.callId;
        state.callParticipants = action.payload.participants;
        state.callStatus = "in-progress";
      })
      .addCase(startCall.rejected, (state, action) => {
        state.callError = action.payload as string;
        state.callStatus = "idle";
      })
      // End Call
      .addCase(endCall.fulfilled, (state) => {
        state.activeCallId = null;
        state.callParticipants = {};
        state.callStatus = "ended";
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { chatId, messages } = action.payload;
        if (!state.chats[chatId]) {
          state.chats[chatId] = {
            id: chatId,
            buyerName: "",
            lastMessage: "",
            isRead: false,
            messages: [],
          };
        }
        state.chats[chatId].messages = messages;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, message } = action.payload;
        if (!state.chats[chatId]) {
          state.chats[chatId] = {
            id: chatId,
            buyerName: "",
            lastMessage: message.content,
            isRead: false,
            messages: [],
          };
        }
        state.chats[chatId].messages.push(message);
        state.chats[chatId].lastMessage = message.content;
      });
  },
});

// Export actions and reducer
export const {
  setCallStatus,
  setCallError,
  setActiveChat,
  setTypingStatus,
  setReadReceipt,
} = chatSlice.actions;

export default chatSlice.reducer;

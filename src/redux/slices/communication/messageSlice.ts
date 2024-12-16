import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import chatbotService from "../../../services/chatbotService";
import chatService from "../../../services/chatService";
import messageService from "../../../services/messageService";




// messageSlice.ts
export interface ChatbotMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  buyerName?: string; // Optional for chatbot
  lastMessage?: string; // Optional for chatbot
  messages: Array<{ sender: "seller" | "buyer"; text: string }>;
}


interface ActiveCall {
  callId: string;
  participants: string[];
  status: "ongoing" | "ended";
}

// Define the state structure
interface MessageState {
  chatbot: {
    messages: ChatbotMessage[];
    loading: boolean;
    error: string | null;
  };
  chat: {
    messages: ChatMessage[];
    activeCalls: ActiveCall[];
    loading: boolean;
    error: string | null;
  };
}

// Initial state
const initialState: MessageState = {
  chatbot: {
    messages: [],
    loading: false,
    error: null,
  },
  chat: {
    messages: [],
    activeCalls: [],
    loading: false,
    error: null,
  },
};

// Async thunks

// Fetch chat messages
export const fetchChatMessages = createAsyncThunk(
  "messages/fetchChatMessages",
  async (_, { rejectWithValue }) => {
    try {
      return await messageService.fetchChatMessages();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch chat messages");
    }
  }
);

// Fetch chatbot messages
export const fetchChatbotMessages = createAsyncThunk(
  "messages/fetchChatbotMessages",
  async (_, { rejectWithValue }) => {
    try {
      return await messageService.fetchChatbotMessages();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch chatbot messages");
    }
  }
);

// Send a chat message
export const sendChatMessage = createAsyncThunk(
  "messages/sendChatMessage",
  async ({ conversationId, content }: { conversationId: string; content: string }, { rejectWithValue }) => {
    try {
      return await messageService.sendChatMessage(conversationId, content);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to send chat message");
    }
  }
);

// Send a chatbot message
export const sendChatbotMessage = createAsyncThunk(
  "messages/sendChatbotMessage",
  async (content: string, { rejectWithValue }) => {
    try {
      return await messageService.sendChatbotMessage(content);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to send chatbot message");
    }
  }
);

// Start a call
export const startCall = createAsyncThunk(
  "chat/startCall",
  async ({ participants, callId }: { participants: string[]; callId?: string }, { rejectWithValue }) => {
    try {
      // Validate that callId is provided
      if (!callId) {
        throw new Error("callId is required to start a call");
      }

      // Pass participants and callId to chatService
      return await chatService.startCall(participants, { chatId: callId });
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || "Failed to start call");
    }
  }
);


// End a call
export const endCall = createAsyncThunk(
  "messages/endCall",
  async ({ callId }: { callId: string }, { rejectWithValue }) => {
    try {
      return await chatService.endCall(callId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to end call");
    }
  }
);

// Slice definition
const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Chat reducers
    builder
      .addCase(fetchChatMessages.pending, (state) => {
        state.chat.loading = true;
        state.chat.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
        state.chat.loading = false;
        state.chat.messages = action.payload;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.chat.loading = false;
        state.chat.error = action.payload as string;
      });

    // Chatbot reducers
    builder
      .addCase(fetchChatbotMessages.pending, (state) => {
        state.chatbot.loading = true;
        state.chatbot.error = null;
      })
      .addCase(fetchChatbotMessages.fulfilled, (state, action: PayloadAction<ChatbotMessage[]>) => {
        state.chatbot.loading = false;
        state.chatbot.messages = action.payload;
      })
      .addCase(fetchChatbotMessages.rejected, (state, action) => {
        state.chatbot.loading = false;
        state.chatbot.error = action.payload as string;
      });

    // Sending messages reducers
    builder
      .addCase(sendChatMessage.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
        state.chat.messages.push(action.payload);
      })
      .addCase(sendChatbotMessage.fulfilled, (state, action: PayloadAction<ChatbotMessage>) => {
        state.chatbot.messages.push(action.payload);
      });

    // Call management reducers
    builder
      .addCase(startCall.fulfilled, (state, action: PayloadAction<ActiveCall>) => {
        state.chat.activeCalls.push(action.payload);
      })
      .addCase(endCall.fulfilled, (state, action: PayloadAction<{ callId: string }>) => {
        state.chat.activeCalls = state.chat.activeCalls.filter((call) => call.callId !== action.payload.callId);
      });
  },
});



export const fetchAllMessages = fetchChatMessages; // Alias for clarity in `CustomerMessaging`

export default messageSlice.reducer;


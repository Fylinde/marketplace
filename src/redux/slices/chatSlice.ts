import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import chatService from "@/services/chatService";

interface CallState {
  activeCallId: string | null;
  callStatus: "idle" | "ringing" | "in-progress" | "ended";
  callParticipants: Record<string, any>;
  callError: string | null;
}

interface ChatState extends CallState {
  chats: Record<string, any>;
  activeChatId: string | null;
  messages: Record<string, any[]>;
  typingStatus: Record<string, boolean>;
  readReceipts: Record<string, boolean>;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: {},
  activeChatId: null,
  messages: {},
  typingStatus: {},
  readReceipts: {},
  loading: false,
  error: null,
  activeCallId: null,
  callStatus: "idle",
  callParticipants: {},
  callError: null,
};

// Thunks
export const startCall = createAsyncThunk(
  "chat/startCall",
  async ({ chatId, participants }: { chatId: string; participants: string[] }, thunkAPI) => {
    try {
      return await chatService.startCall(chatId, participants);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const endCall = createAsyncThunk(
  "chat/endCall",
  async (callId: string, thunkAPI) => {
    try {
      return await chatService.endCall(callId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (chatId: string, thunkAPI) => {
    try {
      const messages = await chatService.getMessages(chatId);
      return { chatId, messages };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch messages");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, message }: { chatId: string; message: string }, thunkAPI) => {
    try {
      const response = await chatService.postMessage(chatId, message);
      return { chatId, message: response };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to send message");
    }
  }
);

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
    addMessage: (state, action: PayloadAction<{ chatId: string; message: any }>) => {
      const { chatId, message } = action.payload;
      state.messages[chatId] = [...(state.messages[chatId] || []), message]; // Append new message
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
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { chatId, messages } = action.payload;
        state.messages[chatId] = messages;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, message } = action.payload;

        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }

        state.messages[chatId].push(message);
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const {
  setCallStatus,
  setCallError,
  setActiveChat,
  setTypingStatus,
  setReadReceipt,
  addMessage,
} = chatSlice.actions;
export default chatSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import chatbotService from "../../../services/chatbotService";

// Define the structure of a chatbot message
export interface ChatbotMessage {
  timestamp: number; // Timestamp of the message
  text: string; // Content of the message
  sender: "bot" | "seller"; // Sender of the message
}

// Define the chatbot state
interface ChatbotState {
  messages: ChatbotMessage[]; // Array of messages
  suggestedResponses: string[]; // Array of AI-suggested responses
  performance: {
    totalConversations: number;
    resolvedByChatbot: number;
    escalatedToHuman: number;
    avgResponseTime: number;
  } | null; // Performance metrics
  loading: boolean; // Loading state
  error: string | null; // Error message
}

// Initial state
const initialState: ChatbotState = {
  messages: [],
  suggestedResponses: [],
  performance: null,
  loading: false,
  error: null,
};

// Async thunks
export const sendMessage = createAsyncThunk(
  "chatbot/sendMessage",
  async ({ message, context }: { message: string; context?: object }, thunkAPI) => {
    try {
      const response = await chatbotService.sendMessage(message, context);
      return response; // Return response directly as `text`
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send message to chatbot"
      );
    }
  }
);

export const fetchConversationHistory = createAsyncThunk(
  "chatbot/fetchConversationHistory",
  async (sessionId: string, thunkAPI) => {
    try {
      const response = await chatbotService.getConversationHistory(sessionId);
      return response; // Should return an array of objects with `message`, `sender`, and `timestamp`
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch conversation history"
      );
    }
  }
);

export const fetchSuggestedResponses = createAsyncThunk(
  "chatbot/fetchSuggestedResponses",
  async (context: object, thunkAPI) => {
    try {
      const response = await chatbotService.getSuggestedResponses(context);
      return response; // Should return an array of strings
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch suggested responses"
      );
    }
  }
);

export const escalateConversation = createAsyncThunk(
  "chatbot/escalateConversation",
  async (sessionId: string, thunkAPI) => {
    try {
      const response = await chatbotService.escalateToHumanSupport(sessionId);
      return response; // Escalation response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to escalate conversation"
      );
    }
  }
);

export const fetchChatbotPerformance = createAsyncThunk(
  "chatbot/fetchPerformance",
  async (_, thunkAPI) => {
    try {
      const response = await chatbotService.getChatbotPerformance();
      return response; // Performance metrics
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch chatbot performance"
      );
    }
  }
);

// Slice
const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatbotMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    resetChatbotState: (state) => {
      state.messages = [];
      state.suggestedResponses = [];
      state.performance = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push({
          sender: "seller",
          text: action.meta.arg.message,
          timestamp: Date.now(),
        });
        state.messages.push({
          sender: "bot",
          text: action.payload, // Corrected to directly use `payload` as the text
          timestamp: Date.now(),
        });
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Conversation History
      .addCase(fetchConversationHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationHistory.fulfilled, (state, action) => {
        // Transform `message` field to `text` for consistency with `ChatbotMessage`
        state.messages = action.payload.map((msg: any) => ({
          text: msg.message,
          sender: msg.sender,
          timestamp: msg.timestamp,
        }));
        state.loading = false;
      })
      .addCase(fetchConversationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Suggested Responses
      .addCase(fetchSuggestedResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestedResponses.fulfilled, (state, action) => {
        state.suggestedResponses = action.payload;
        state.loading = false;
      })
      .addCase(fetchSuggestedResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Escalate Conversation
      .addCase(escalateConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(escalateConversation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(escalateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Performance
      .addCase(fetchChatbotPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatbotPerformance.fulfilled, (state, action) => {
        state.performance = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatbotPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addMessage, clearMessages, resetChatbotState } = chatbotSlice.actions;
export default chatbotSlice.reducer;

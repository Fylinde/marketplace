import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatbotService from "../../services/chatbotService";


interface ChatbotState {
  messages: { id: string; text: string; sender: 'user' | 'bot' }[];
  loading: boolean;
  error: string | null;
}
/**
 * Send a message to the chatbot and receive a response.
 */
export const sendMessage = createAsyncThunk(
  "chatbot/sendMessage",
  async ({ message, context }: { message: string; context?: object }, thunkAPI) => {
    try {
      return await chatbotService.sendMessage(message, context);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to send message to chatbot"
      );
    }
  }
);

/**
 * Fetch conversation history for a specific session.
 */
export const fetchConversationHistory = createAsyncThunk(
  "chatbot/fetchConversationHistory",
  async (sessionId: string, thunkAPI) => {
    try {
      return await chatbotService.getConversationHistory(sessionId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to fetch conversation history"
      );
    }
  }
);

/**
 * Fetch AI-suggested responses for a specific context.
 */
export const fetchSuggestedResponses = createAsyncThunk(
  "chatbot/fetchSuggestedResponses",
  async (context: object, thunkAPI) => {
    try {
      return await chatbotService.getSuggestedResponses(context);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to fetch suggested responses"
      );
    }
  }
);

/**
 * Escalate a chatbot conversation to human support.
 */
export const escalateConversation = createAsyncThunk(
  "chatbot/escalateConversation",
  async (sessionId: string, thunkAPI) => {
    try {
      return await chatbotService.escalateToHumanSupport(sessionId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to escalate conversation"
      );
    }
  }
);

/**
 * Fetch chatbot performance metrics.
 */
export const fetchChatbotPerformance = createAsyncThunk(
  "chatbot/fetchPerformance",
  async (_, thunkAPI) => {
    try {
      return await chatbotService.getChatbotPerformance();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to fetch chatbot performance"
      );
    }
  }
);

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState: {
    messages: [] as { sender: string; message: string; timestamp: string }[],
    suggestedResponses: [] as string[],
    performance: null as {
      totalConversations: number;
      resolvedByChatbot: number;
      escalatedToHuman: number;
      avgResponseTime: number;
    } | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    addMessage: (state, action) => {
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
          sender: "User",
          message: action.meta.arg.message,
          timestamp: new Date().toISOString(),
        });
        state.messages.push({
          sender: "Chatbot",
          message: action.payload,
          timestamp: new Date().toISOString(),
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
        state.messages = action.payload;
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
      .addCase(escalateConversation.fulfilled, (state, action) => {
        state.loading = false;
        alert(action.payload); // Notify user about escalation status
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

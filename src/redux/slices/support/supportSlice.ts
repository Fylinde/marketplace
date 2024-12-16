import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import supportService, { SupportTicket } from "../../../services/supportService";
import { incrementHumanResolved } from "../analytics/analyticsSlice";
import { RootState } from "../../store";


// Define KnowledgeBaseArticle Interface
export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

// Define SupportState Interface
interface SupportState {
  knowledgeBase: KnowledgeBaseArticle[];
  loading: boolean;
  error: string | null;
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
}

// Define Initial State
const initialState: SupportState = {
  knowledgeBase: [],
  loading: false,
  error: null,
  tickets: [],
  selectedTicket: null,
};

// Async Thunks
export const submitAISuggestion = createAsyncThunk<
  void, // Return type
  string, // Argument type
  { rejectValue: string } // Rejected value type
>("support/submitAISuggestion", async (suggestion, thunkAPI) => {
  try {
    await supportService.submitAISuggestion(suggestion);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.message || "Failed to submit AI suggestion."
    );
  }
});


// Thunk to create a support ticket
export const createSupportTicket = createAsyncThunk(
  "support/createSupportTicket",
  async (ticketData: Partial<SupportTicket>, thunkAPI) => {
    try {
      return await supportService.createSupportTicket(ticketData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create support ticket");
    }
  }
);

export const fetchSupportTickets = createAsyncThunk<
  SupportTicket[], // Correct return type
  void,
  { rejectValue: string }
>("support/fetchSupportTickets", async (_, thunkAPI) => {
  try {
    const response = await supportService.fetchSupportTickets();
    return response.map((ticket: any) => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      subject: ticket.subject || "No subject provided",
      customerId: ticket.customerId || "Unknown",
      description: ticket.description || "",
      createdAt: ticket.createdAt || new Date().toISOString(),
      updatedAt: ticket.updatedAt || null,
      messages: ticket.messages || [], // Provide a default value
    }));
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.message || "Failed to fetch support tickets."
    );
  }
});


export const fetchKnowledgeBaseArticles = createAsyncThunk<
  KnowledgeBaseArticle[], // Correct return type
  void,
  { rejectValue: string }
>("support/fetchKnowledgeBaseArticles", async (_, thunkAPI) => {
  try {
    const response = await supportService.fetchKnowledgeBaseArticles();
    return response.map((article: any) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      tags: article.tags || [], // Provide a default value for tags
    }));
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.message || "Failed to fetch knowledge base articles."
    );
  }
});




/**
 * Fetch details of a specific support ticket.
 */
export const fetchSupportTicketById = createAsyncThunk(
  "support/fetchSupportTicketById",
  async (ticketId: string, thunkAPI) => {
    try {
      return await supportService.getSupportTicketById(ticketId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to fetch support ticket details"
      );
    }
  }
);

/**
 * Update the status of a support ticket.
 */
export const updateTicketStatus = createAsyncThunk(
  "support/updateTicketStatus",
  async (
    { ticketId, status }: { ticketId: string; status: "Open" | "In Progress" | "Resolved" | "Closed" },
    thunkAPI
  ) => {
    try {
      return await supportService.updateTicketStatus(ticketId, status);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to update ticket status"
      );
    }
  }
);

/**
 * Add a message to a support ticket.
 */
export const addTicketMessage = createAsyncThunk(
  "support/addTicketMessage",
  async (
    { ticketId, message }: { ticketId: string; message: { sender: string; message: string } },
    thunkAPI
  ) => {
    try {
      return await supportService.addTicketMessage(ticketId, message);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to add message to ticket"
      );
    }
  }
);

/**
 * Fetch AI suggestions for a ticket.
 */
export const fetchAISolutions = createAsyncThunk(
  "support/fetchAISolutions",
  async (ticketId: string, thunkAPI) => {
    try {
      return await supportService.getAISolutionsForTicket(ticketId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to fetch AI suggestions for ticket"
      );
    }
  }
);

/**
 * Escalate a ticket to human support.
 */
export const escalateTicketToHuman = createAsyncThunk(
  "support/escalateTicketToHuman",
  async (ticketId: string, thunkAPI) => {
    try {
      const result = await supportService.escalateUnresolvedTicket(ticketId);
      thunkAPI.dispatch(incrementHumanResolved());
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to escalate ticket"
      );
    }
  }
);

export const selectKnowledgeBase = (state: RootState) => ({
  knowledgeBase: state.support.knowledgeBase,
  loading: state.support.loading,
  error: state.support.error,
});

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(submitAISuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAISuggestion.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitAISuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred.";
      })
      .addCase(fetchSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred.";
      })
      .addCase(fetchKnowledgeBaseArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload; // Properly typed `SupportTicket[]`
      })
      .addCase(fetchKnowledgeBaseArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.knowledgeBase = action.payload; // Properly typed `KnowledgeBaseArticle[]`
      })



      .addCase(fetchKnowledgeBaseArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred.";
      });


    builder
      // Fetch AI Suggestions
      .addCase(fetchAISolutions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAISolutions.fulfilled, (state, action) => {
        if (state.selectedTicket) {
          state.selectedTicket.aiSuggestions = action.payload; // Store AI suggestions in the ticket
        }
        state.loading = false;
      })
      .addCase(fetchAISolutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      // Escalate Ticket
      .addCase(escalateTicketToHuman.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(escalateTicketToHuman.fulfilled, (state) => {
        state.loading = false;
        alert("The ticket has been escalated to human support.");
      })
      .addCase(escalateTicketToHuman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      // Create ticket
      .addCase(createSupportTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSupportTicket.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
        state.loading = false;
      })
      .addCase(createSupportTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      // Fetch specific ticket
      .addCase(fetchSupportTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportTicketById.fulfilled, (state, action) => {
        state.selectedTicket = action.payload;
        state.loading = false;
      })
      .addCase(fetchSupportTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      // Update ticket status
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const { ticketId, status } = action.meta.arg;
        const ticket = state.tickets.find((t) => t.id === ticketId);
        if (ticket) ticket.status = status;
      });

    builder
      // Add ticket message
      .addCase(addTicketMessage.fulfilled, (state, action) => {
        if (state.selectedTicket) {
          state.selectedTicket.messages.push(action.payload);
        }
      });
  },
});

export default supportSlice.reducer;

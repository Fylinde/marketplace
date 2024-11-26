import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supportService, { SupportTicket } from "../../services/supportService";
import { incrementHumanResolved } from "./analyticsSlice";


/**
 * Create a new support ticket.
 */
export const createSupportTicket = createAsyncThunk(
  "support/createSupportTicket",
  async (ticketData: Partial<SupportTicket>, thunkAPI) => {
    try {
      return await supportService.createSupportTicket(ticketData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as any)?.response?.data?.message || "Failed to create support ticket"
      );
    }
  }
);

/**
 * Fetch all support tickets with optional filters.
 */
export const fetchSupportTickets = createAsyncThunk(
    "support/fetchSupportTickets",
    async (args: { filters?: { status?: string; customerId?: string } }, thunkAPI) => {
      const { filters } = args;
      try {
        return await supportService.getSupportTickets(filters);
      } catch (error) {
        return thunkAPI.rejectWithValue(
          (error as any)?.response?.data?.message || "Failed to fetch support tickets"
        );
      }
    }
  );
  

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
  

const supportSlice = createSlice({
  name: "support",
  initialState: {
    tickets: [] as SupportTicket[],
    selectedTicket: null as SupportTicket | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
    extraReducers: (builder) => {
      
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
    })
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
    })
        
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
      })
      // Fetch tickets
      .addCase(fetchSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.loading = false;
      })
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
      })
      // Update ticket status
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const { ticketId, status } = action.meta.arg;
        const ticket = state.tickets.find((t) => t.id === ticketId);
        if (ticket) ticket.status = status;
      })
      // Add ticket message
      .addCase(addTicketMessage.fulfilled, (state, action) => {
        if (state.selectedTicket) {
          state.selectedTicket.messages.push(action.payload);
        }
      });
  },
});

export default supportSlice.reducer;

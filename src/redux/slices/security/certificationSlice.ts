import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import certificationService, { Certification } from "../../../services/certificationService";

interface CertificationState {
  certifications: Certification[];
  loading: boolean;
  error: string | null;
}

const initialState: CertificationState = {
  certifications: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchCertifications = createAsyncThunk<Certification[], void>(
  "certifications/fetchCertifications",
  async (_, { rejectWithValue }) => {
    try {
      return await certificationService.getCertifications();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch certifications");
    }
  }
);

export const addCertification = createAsyncThunk<Certification, Certification>(
  "certifications/addCertification",
  async (certification, { rejectWithValue }) => {
    try {
      return await certificationService.addCertification(certification);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add certification");
    }
  }
);

export const updateCertification = createAsyncThunk<Certification, Certification>(
  "certifications/updateCertification",
  async (certification, { rejectWithValue }) => {
    try {
      return await certificationService.updateCertification(certification);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update certification");
    }
  }
);

export const deleteCertification = createAsyncThunk<string, string>(
  "certifications/deleteCertification",
  async (certificationId, { rejectWithValue }) => {
    try {
      await certificationService.deleteCertification(certificationId);
      return certificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete certification");
    }
  }
);

// Slice
const certificationSlice = createSlice({
  name: "certifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Certifications
      .addCase(fetchCertifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertifications.fulfilled, (state, action: PayloadAction<Certification[]>) => {
        state.certifications = action.payload;
        state.loading = false;
      })
      .addCase(fetchCertifications.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Add Certification
      .addCase(addCertification.fulfilled, (state, action: PayloadAction<Certification>) => {
        state.certifications.push(action.payload);
      })
      .addCase(addCertification.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update Certification
      .addCase(updateCertification.fulfilled, (state, action: PayloadAction<Certification>) => {
        const index = state.certifications.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.certifications[index] = action.payload;
        }
      })
      .addCase(updateCertification.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete Certification
      .addCase(deleteCertification.fulfilled, (state, action: PayloadAction<string>) => {
        state.certifications = state.certifications.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCertification.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default certificationSlice.reducer;

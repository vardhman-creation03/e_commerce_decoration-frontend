import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventService } from '../../lib/services/eventService';

export const getEventDetail = createAsyncThunk(
  'events/getDetail',
  async (id, { rejectWithValue }) => {
    try {
      const data = await eventService.getEventDetail(id);
      return data.data || data.event || data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllEvents = createAsyncThunk(
  'events/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await eventService.getAllEvents();
      return data.events || data.data || data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const submitEventInquiry = createAsyncThunk(
  'events/submitInquiry',
  async (inquiryData, { rejectWithValue }) => {
    try {
      const data = await eventService.submitInquiry(inquiryData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit inquiry');
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    selectedEvent: null,
    events: [],
    loading: false,
    fetchingDetail: false,
    submittingInquiry: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
    clearEventSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearEventError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Events
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload || [];
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Event Detail
      .addCase(getEventDetail.pending, (state) => {
        state.fetchingDetail = true;
        state.error = null;
      })
      .addCase(getEventDetail.fulfilled, (state, action) => {
        state.fetchingDetail = false;
        state.selectedEvent = action.payload;
      })
      .addCase(getEventDetail.rejected, (state, action) => {
        state.fetchingDetail = false;
        state.error = action.payload;
      })
      // Submit Inquiry
      .addCase(submitEventInquiry.pending, (state) => {
        state.submittingInquiry = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitEventInquiry.fulfilled, (state, action) => {
        state.submittingInquiry = false;
        state.successMessage = action.payload.message || 'Inquiry submitted successfully!';
      })
      .addCase(submitEventInquiry.rejected, (state, action) => {
        state.submittingInquiry = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedEvent, clearEventSuccessMessage, clearEventError } = eventSlice.actions;
export default eventSlice.reducer;

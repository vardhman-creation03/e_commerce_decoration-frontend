import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../lib/services/bookingService';

export const createBooking = createAsyncThunk(
    'booking/create',
    async (bookingData, { rejectWithValue }) => {
        try {
            const data = await bookingService.createBooking(bookingData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        currentBooking: null,
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearBookingState: (state) => {
            state.currentBooking = null;
            state.loading = false;
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBooking = action.payload.booking;
                state.successMessage = action.payload.message;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;

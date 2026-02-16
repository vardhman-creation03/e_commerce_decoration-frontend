import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../lib/services/userService';

// Get bookings by contact (mobile or email) - Public
export const getBookingsByContact = createAsyncThunk(
    'user/getBookingsByContact',
    async ({ mobile, email }, { rejectWithValue }) => {
        try {
            const data = await userService.getBookingsByContact(mobile, email);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Get booking by ID - Public
export const getBookingById = createAsyncThunk(
    'user/getBookingById',
    async (bookingId, { rejectWithValue }) => {
        try {
            const data = await userService.getBookingById(bookingId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Admin Thunks - Public (no auth required)
export const getAllCustomers = createAsyncThunk(
    'user/getAllCustomers',
    async (params, { rejectWithValue }) => {
        try {
            const data = await userService.getAllCustomers(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        bookings: [],
        booking: null,
        customers: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        clearBookings: (state) => {
            state.bookings = [];
        },
        clearBooking: (state) => {
            state.booking = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Bookings by Contact
            .addCase(getBookingsByContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookingsByContact.fulfilled, (state, action) => {
                state.loading = false;
                // Handle both response formats: bookings array or recentActivity array
                if (action.payload.bookings) {
                    state.bookings = action.payload.bookings;
                } else if (action.payload.recentActivity) {
                    // Filter only bookings from recentActivity (exclude inquiries)
                    state.bookings = action.payload.recentActivity.filter(
                        item => item.type === 'Booking'
                    ).map(item => ({
                        _id: item._id,
                        bookingId: item.bookingId,
                        bookingDate: item.date,
                        bookingStatus: item.status,
                        totalAmount: item.amount,
                        eventSnapshot: { title: item.title },
                        eventLocation: item.details || null
                    }));
                } else {
                    state.bookings = [];
                }
            })
            .addCase(getBookingsByContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Booking by ID
            .addCase(getBookingById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookingById.fulfilled, (state, action) => {
                state.loading = false;
                state.booking = action.payload.booking;
            })
            .addCase(getBookingById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get All Customers (Admin)
            .addCase(getAllCustomers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload;
            })
            .addCase(getAllCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUserError, clearBookings, clearBooking } = userSlice.actions;
export default userSlice.reducer;

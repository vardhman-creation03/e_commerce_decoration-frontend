import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../lib/services/bookingService';

export const createPaymentOrder = createAsyncThunk(
    'payment/createOrder',
    async ({ orderId, amount }, { rejectWithValue }) => {
        try {
            // Amount in paise
            const data = await bookingService.createPaymentOrder({ amount, currency: 'INR' });
            return { ...data.order, razorpayOrderId: data.order.id };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const verifyPayment = createAsyncThunk(
    'payment/verify',
    async (paymentData, { rejectWithValue }) => {
        try {
            // paymentData expects: { bookingId, transactionId (payment_id) }
            // Backend expects: { bookingId, transactionId }
            // Frontend Razorpay returns: razorpay_payment_id, razorpay_order_id, razorpay_signature

            // We map razorpay_payment_id to transactionId for backend
            const payload = {
                bookingId: paymentData.orderId, // In our context, orderId IS bookingId
                transactionId: paymentData.razorpay_payment_id
            };

            const data = await bookingService.verifyOnlinePayment(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const handlePaymentFailure = createAsyncThunk(
    'payment/failure',
    async ({ orderId, error }, { rejectWithValue }) => {
        // Logic to handle failure, typically just logging or updating status if backend supported it
        return { orderId, error };
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        loading: false,
        error: null,
        paymentStatus: 'idle', // idle, processing, succeeded, failed
    },
    reducers: {
        resetPaymentState: (state) => {
            state.loading = false;
            state.error = null;
            state.paymentStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPaymentOrder.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createPaymentOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true;
                state.paymentStatus = 'processing';
            })
            .addCase(verifyPayment.fulfilled, (state) => {
                state.loading = false;
                state.paymentStatus = 'succeeded';
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.paymentStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;

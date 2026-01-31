import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const cancelOrder = createAsyncThunk(
    'createOrder/cancel',
    async ({ orderId }, { rejectWithValue }) => {
        return { message: "Cancelled" };
    }
);

const createOrderSlice = createSlice({
    name: 'createOrder',
    initialState: {
    },
    reducers: {
    },
});

export default createOrderSlice.reducer;

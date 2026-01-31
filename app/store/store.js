import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './eventSlice';
import paymentReducer from './paymentSlice';
import bookingReducer from './bookingSlice';
// Placeholder reducers for missing slices to prevent crash
import cartReducer from './cartSlice';
import createOrderReducer from './createOrderSlice';

import userReducer from './userSlice';
import contactReducer from './contactSlice';

export const store = configureStore({
    reducer: {
        events: eventReducer,
        payment: paymentReducer,
        booking: bookingReducer,
        cart: cartReducer,
        createOrder: createOrderReducer,
        user: userReducer,
        contact: contactReducer
    },
});

import { createSlice } from '@reduxjs/toolkit';

// Placeholder cart slice to satisfy imports
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {
        viewCart: (state) => {
            // Placeholder
        },
        addToCart: (state, action) => {
            state.products.push(action.payload);
        }
    },
});

export const { viewCart, addToCart } = cartSlice.actions;
export default cartSlice.reducer;

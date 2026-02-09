import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../lib/services/userService';

export const getUserProfile = createAsyncThunk(
    'user/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.getUserProfile();
            return data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const data = await userService.updateUserProfile(profileData);
            return data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getUserAddress = createAsyncThunk(
    'user/getAddress',
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.getUserAddress();
            return data.addresses;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addUserAddress = createAsyncThunk(
    'user/addAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            const data = await userService.addUserAddress(addressData);
            return data.address;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteUserAddress = createAsyncThunk(
    'user/deleteAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            await userService.deleteUserAddress(addressId);
            return addressId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Admin Thunks (if needed here, or specialized adminUserSlice)
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

export const getUserDashboardStats = createAsyncThunk(
    'user/getDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const data = await userService.getUserDashboardStats();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        addressList: [],
        dashboardStats: null,
        loading: false,
        addressLoading: false,
        dashboardLoading: false,
        error: null,
    },
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Profile
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Addresses
            .addCase(getUserAddress.pending, (state) => {
                state.addressLoading = true;
            })
            .addCase(getUserAddress.fulfilled, (state, action) => {
                state.addressLoading = false;
                state.addressList = action.payload || [];
            })
            .addCase(getUserAddress.rejected, (state, action) => {
                state.addressLoading = false;
                // Don't set global error for address fetch fail, maybe just log
            })
            // Add Address
            .addCase(addUserAddress.pending, (state) => {
                state.addressLoading = true;
            })
            .addCase(addUserAddress.fulfilled, (state, action) => {
                state.addressLoading = false;
                state.addressList.push(action.payload);
            })
            .addCase(addUserAddress.rejected, (state, action) => {
                state.addressLoading = false;
                state.error = action.payload;
            })
            // Delete Address
            .addCase(deleteUserAddress.fulfilled, (state, action) => {
                state.addressList = state.addressList.filter(addr => addr._id !== action.payload);
            })
            // Dashboard Stats
            .addCase(getUserDashboardStats.pending, (state) => {
                state.dashboardLoading = true;
            })
            .addCase(getUserDashboardStats.fulfilled, (state, action) => {
                state.dashboardLoading = false;
                state.dashboardStats = action.payload;
            })
            .addCase(getUserDashboardStats.rejected, (state, action) => {
                state.dashboardLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;

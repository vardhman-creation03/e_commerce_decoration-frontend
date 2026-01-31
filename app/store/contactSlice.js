import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contactService } from '../../lib/services/contactService';

export const submitContact = createAsyncThunk(
    'contact/submit',
    async (contactData, { rejectWithValue }) => {
        try {
            const data = await contactService.sendContactMessage(contactData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send message');
        }
    }
);

export const getAllContacts = createAsyncThunk(
    'contact/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await contactService.getAllContacts();
            return data.contacts || data.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
        }
    }
);

// Admin Action
export const updateContactStatus = createAsyncThunk(
    'contact/updateStatus',
    async ({ id, statusData }, { rejectWithValue }) => {
        try {
            const data = await contactService.updateContactStatus(id, statusData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update contact status');
        }
    }
);

const contactSlice = createSlice({
    name: 'contact',
    initialState: {
        contacts: [],
        submitting: false,
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearContactMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Submit Contact
            .addCase(submitContact.pending, (state) => {
                state.submitting = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(submitContact.fulfilled, (state, action) => {
                state.submitting = false;
                state.successMessage = action.payload.message || 'Message sent successfully!';
            })
            .addCase(submitContact.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Get All Contacts
            .addCase(getAllContacts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = action.payload;
            })
            .addCase(getAllContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearContactMessages } = contactSlice.actions;
export default contactSlice.reducer;

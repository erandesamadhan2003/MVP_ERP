import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LookupState {
    Talukas: string[];
}

const initialState: LookupState = {
    Talukas: [],
}

const lookupSlice = createSlice({
    name: 'lookup',
    initialState,
    reducers: {
        setTalukas: (state, action: PayloadAction<string[]>) => {
            state.Talukas = action.payload;
        },
        clearLookup: state => {
            state.Talukas = [];
        },
    },
});

export const { setTalukas, clearLookup } = lookupSlice.actions;
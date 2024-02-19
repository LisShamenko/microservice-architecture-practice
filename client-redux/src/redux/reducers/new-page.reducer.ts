import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { dtoSection } from './types/dtoSection';



// store._state.newPage

export interface dtoNewPage {
    section: dtoSection | null;
    status: 'none' | 'idle' | 'loading' | 'failed';
}

export const initialState: dtoNewPage = {
    section: null,
    status: 'none',
}

// reducer

export const newPageSlice = createSlice({
    name: 'new-page',
    initialState,
    reducers: {
        setNewSection: (state, action: PayloadAction<dtoSection>) => {
            state.section = { ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSectionAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getSectionAsync.fulfilled, (state, action) => {
                state.section = { ...action.payload };
                state.status = 'idle';
            })
            .addCase(getSectionAsync.rejected, (state) => {
                state.status = 'failed';
            });
    },
});
export const { setNewSection } = newPageSlice.actions;
export const newPageReducer = newPageSlice.reducer;

// creators

const getSectionApi = async (id: string) => {
    return new Promise<{ data: dtoSection }>((resolve) => {
        setTimeout(() => resolve({ data: { id: 'id', title: 'title' } }), 100);
    });
}

export const getSectionAsync = createAsyncThunk(
    'new-page/getSection',
    async (id: string) => {
        return (await getSectionApi(id)).data;
    }
);

// selectors

export const selectSection = (state: any) => state.newPage.section;

// actions

export const renameSection = (title: string): AppThunk => (dispatch, getState) => {
    const curSection = selectSection(getState());
    if (!curSection) dispatch(setNewSection({ ...curSection, title: title }));
};

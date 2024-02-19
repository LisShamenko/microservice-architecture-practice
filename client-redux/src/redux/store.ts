import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { newPageSlice } from './reducers/new-page.reducer';
import { loginPageReducer } from './reducers/login-page.reducer';



// 
const store = configureStore({
    reducer: {
        newPage: newPageSlice.reducer,
        loginPage: loginPageReducer,
    },
});
export default store;



//
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType, RootState, unknown, Action<string>
>;

export type cssType = {
    readonly [key: string]: string
};



//
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

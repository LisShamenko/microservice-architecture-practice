import thunk from 'redux-thunk';
import { ThunkAction, Action } from '@reduxjs/toolkit';
import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';
//
import { oldPageReducer, oldPageInitial } from './reducers/old-page.reducer';



// 
const composeEnhancers = composeWithDevTools({
});

const store = createStore(
    combineReducers({
        oldPage: oldPageReducer,
    }),
    {
        oldPage: oldPageInitial,
    },
    composeEnhancers(
        applyMiddleware(thunk)
    ),
);
export default store;

// 
export type OldAppDispatch = typeof store.dispatch;

export type OldRootState = ReturnType<typeof store.getState>;

export type OldAppThunk<ReturnType = void> = ThunkAction<
    ReturnType, OldRootState, unknown, Action<string>
>;

export type cssType = {
    readonly [key: string]: string
};

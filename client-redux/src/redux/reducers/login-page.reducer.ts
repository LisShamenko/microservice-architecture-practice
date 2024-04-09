import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// 
import loginModuleAPI from '../../api/loginModuleAPI';
import { ErrorAPI } from '../../api/types/ErrorAPI';
import { ISubmitRegisterForm } from '../../modules/widget/form/RegisterForm';
import { ISubmitDashboardPage } from '../../modules/page/DashboardPage/DashboardPage';
import { ISubmitLoginForm } from '../../modules/widget/form/LoginForm';
import { IUpdateToken } from '../../providers/ErrorProvider';
import { IGetUser } from '../../modules/page/DashboardPage/DashboardPageContainer';



// store._state.loginPage

export type RequestStatus = 'none' | 'ready' | 'loading' | 'failed';

export type dtoTokens = {
    error: ErrorAPI | Error | string | null,
    userId: string,
    update: string | null,
    username: string | null,
    accessToken: string | null;
    // 
    loginStatus: RequestStatus;
    registerStatus: RequestStatus;
    logoutStatus: RequestStatus;
}

export const initialState: dtoTokens = {
    error: null,
    userId: '',
    update: localStorage.getItem('update'),
    username: localStorage.getItem('username'),
    accessToken: localStorage.getItem('access-token'),
    loginStatus: 'none',
    registerStatus: 'none',
    logoutStatus: 'none',
}

// reducer

function addBuilderCase(
    builder: any, thunk: any, statusProp: string,
    readyHandler: (state: any, action: any) => void,
) {
    builder
        .addCase(thunk.pending, (state: any) => {
            state[statusProp] = 'loading';
        })
        .addCase(thunk.fulfilled, (state: any, action: any) => {
            readyHandler(state, action);
            state[statusProp] = 'ready';
        })
        .addCase(thunk.rejected, (state: any, action: any) => {
            state[statusProp] = 'failed';
        })
}

function setTokens(state: any, action: any) {
    if (action.payload.isRemember) {
        localStorage.setItem('is-remember', 'true');
        localStorage.setItem('update', action.payload.update);
        localStorage.setItem('username', action.payload.username);
        localStorage.setItem('access-token', action.payload.accessToken);
    }
    else {
        localStorage.removeItem('is-remember');
        localStorage.removeItem('update');
        localStorage.removeItem('username');
        localStorage.removeItem('access-token');
    }
    state.update = action.payload.update;
    state.username = action.payload.username;
    state.accessToken = action.payload.accessToken;
    state['logoutStatus'] = 'none';
}

export const slice = createSlice({
    name: 'login-page',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<ErrorAPI | Error | string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {

        builder.addCase(getUser.fulfilled, (state: any, action: any) => {
            state.userId = action.payload.id;
            state.username = action.payload.username;
        });

        builder.addCase(updateToken.fulfilled, (state: any, action: any) => {
            if (action.payload.update === null) return;

            const isRemember = localStorage.getItem('is-remember');
            if (isRemember) {
                localStorage.setItem('update', action.payload.update);
                localStorage.setItem('access-token', action.payload.accessToken);
            }
            state.update = action.payload.update;
            state.accessToken = action.payload.accessToken;
        });

        addBuilderCase(builder, loginUser, 'loginStatus', (state, action) => {
            setTokens(state, action);
        });

        addBuilderCase(builder, registerUser, 'registerStatus', (state, action) => {
            if (action.payload.id) {
                setTokens(state, action);
            }
        });

        addBuilderCase(builder, logoutUser, 'logoutStatus', (state, action) => {
            localStorage.removeItem('is-remember');
            localStorage.removeItem('update');
            localStorage.removeItem('username');
            localStorage.removeItem('access-token');
            state['loginStatus'] = 'none';
            state['registerStatus'] = 'none';
        });
    },
});
export const { setError } = slice.actions;
export const loginPageReducer = slice.reducer;

// creators

export const getUser = createAsyncThunk(
    'login-page/getUser',
    async ({ username, accessToken }: IGetUser) => {
        const user = await loginModuleAPI.getUser(username, accessToken);
        return { ...user };
    }
);

export const loginUser = createAsyncThunk(
    'login-page/loginUser',
    async ({ username, password, isRemember }: ISubmitLoginForm) => {
        const tokens = await loginModuleAPI.loginUser(username, password);
        return { username, ...tokens, isRemember };
    }
);

export const updateToken = createAsyncThunk(
    'login-page/updateToken',
    async ({ update, username, accessToken }: IUpdateToken) => {
        const tokens = await loginModuleAPI.updateToken(update, username, accessToken);
        return tokens;
    }
);

export const registerUser = createAsyncThunk(
    'login-page/registerUser',
    async ({ username, password }: ISubmitRegisterForm) => {
        const id = await loginModuleAPI.registerUser(username, password);
        const tokens = await loginModuleAPI.loginUser(username, password);
        return { id, username, ...tokens, isRemember: true }
    }
);

export const logoutUser = createAsyncThunk(
    'login-page/logoutUser',
    async ({ username, accessToken }: ISubmitDashboardPage) => {
        const result = await loginModuleAPI.logoutUser(username, accessToken);
        return { result };
    }
);

// selectors

export const selectError = (state: any) => state.loginPage.error;
export const selectUserId = (state: any) => state.loginPage.userId as string;
export const selectUsername = (state: any) => state.loginPage.username as string;
export const selectUpdate = (state: any) => state.loginPage.update as string;
export const selectAccessToken = (state: any) => state.loginPage.accessToken as string;
export const selectLoginStatus = (state: any) => state.loginPage.loginStatus as RequestStatus;
export const selectRegisterStatus = (state: any) => state.loginPage.registerStatus as RequestStatus;
export const selectLogoutStatus = (state: any) => state.loginPage.logoutStatus as RequestStatus;

// actions

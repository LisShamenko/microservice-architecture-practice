import { makeAutoObservable } from "mobx";
import loginModuleAPI from "../api/loginModuleAPI";



// 
class AuthStore {
    username: string = '';
    update: string = '';
    accessToken: string = '';
    error?: string;

    constructor() {
        makeAutoObservable(this);

        // 
        const username = localStorage.getItem('username');
        const accessToken = localStorage.getItem('access-token');
        if (username && accessToken) {
            this.username = username;
            this.accessToken = accessToken;
        }
    }

    setAuth = (username: string, update: string, accessToken: string) => {
        this.username = username;
        this.update = update;
        this.accessToken = accessToken;

        // 
        localStorage.setItem('username', username);
        localStorage.setItem('update', update);
        localStorage.setItem('access-token', accessToken);
    }

    setError = (error: string) => {
        this.error = error;
    }
}

const authStore = new AuthStore();
export default authStore;

// 
export const queryUpdateToken = async (username: string, access_token: string) => {
    const data = await loginModuleAPI.updateToken(username, access_token);
    authStore.setAuth(username, data.update, data.accessToken);
    return data;
}

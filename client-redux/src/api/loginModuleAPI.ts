import { instanceAPI } from './instanceAPI';
import { RejectFunc, UserDto, TokensDto } from './types/LoginAPI';



// 
const loginModuleAPI = {

    setInterceptor: (rejectFunc: RejectFunc) => {
        return instanceAPI.interceptors.response
            .use((response) => response, rejectFunc);
    },

    removeInterceptor: (interceptor: number) => {
        instanceAPI.interceptors.request.eject(interceptor);
    },

    // 
    getUser: (username: string, accessToken: string) => {
        return instanceAPI
            .get<UserDto>(`auth/user`, {
                params: {
                    username: username,
                    access_token: accessToken,
                },
            })
            .then(response => response.data as UserDto);
    },

    // 
    loginUser: (username: string, password: string) => {
        return instanceAPI
            .post<TokensDto>(`auth/login`, { username, password })
            .then(response => response.data as TokensDto);
    },

    registerUser: (username: string, password: string) => {
        return instanceAPI
            .post(`auth/register`, { username, password })
            .then(response => response.data);
    },

    logoutUser: (username: string, accessToken: string) => {
        return instanceAPI
            .post(`auth/logout`, { username, accessToken })
            .then(response => response.data);
    },

    updateToken: (update: string, username: string, accessToken: string) => {
        return instanceAPI
            .post<TokensDto>(`auth/update`, { update, username, accessToken })
            .then(response => response.data as TokensDto);
    },

}
export default loginModuleAPI;

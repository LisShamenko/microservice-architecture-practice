import { instanceAPI } from './instanceAPI';



// 
export type TokensDto = {
    accessToken: string;
    refreshToken: string;
}

export type GetUserDto = {
    username: string,
    accessToken: string,
}

export type UserDto = {
    id: string;
    username: string;
}

export type RejectFunc = (error: any) => any;



// 
const loginModuleAPI = {

    setInterceptor: (rejectFunc: RejectFunc) => {
        return instanceAPI.interceptors.response
            .use((response) => response, rejectFunc);
    },

    removeInterceptor: (interceptor: number) => {
        instanceAPI.interceptors.request.eject(interceptor);
    },

    loginUser: (
        username: string, password: string,
    ): Promise<TokensDto> => {
        return instanceAPI
            .get(`login/get_tokens`, {
                params: { username, password }
            })
            .then(response => response.data as TokensDto);
    },

    getUser: (
        { username, accessToken }: GetUserDto,
    ): Promise<UserDto> => {
        return instanceAPI
            .get(`login/get_user`, {
                params: { username },
                headers: { 'Authorization': 'Bearer ' + accessToken }
            })
            .then(response => response.data as UserDto);
    },

    updateAccessToken: (
        refresh_token: string,
    ): Promise<TokensDto> => {
        return instanceAPI
            .get(`login/update_tokens`, {
                params: { refresh_token }
            })
            .then(response => response.data as TokensDto)
    },

    registerUser: (username: string, password: string) => {
        return instanceAPI
            .post(`login/register_user`, { username, password })
            .then(response => response.data)
    },

    logoutUser: (access_token: string, refresh_token: string) => {
        return instanceAPI
            .post(`login/logout_user`,
                { access_token, refresh_token },
                {
                    headers: { 'Authorization': 'Bearer ' + access_token }
                }
            ).then(response => response.data)
    },

}
export default loginModuleAPI;

import { instanceAPI } from './instanceAPI';
import { RejectFunc, TokensDto } from './types/LoginAPI';



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
    updateToken: (username: string, accessToken: string) => {
        return instanceAPI
            .post<TokensDto>(`auth/update`, { username, accessToken })
            .then(response => response.data as TokensDto);
    },

}
export default loginModuleAPI;

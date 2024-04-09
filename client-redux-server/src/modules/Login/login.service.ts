import { ForbiddenException, Injectable } from '@nestjs/common';
import { catchError, map, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
// 
import { TokensDto } from './dto/tokens.dto';
import { UserAuthDto } from '../RedisClient/dto/user-auth.dto';



//
@Injectable()
export class LoginService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    // 
    async loginUser(username: string, password: string) {

        const url = this.configService.get('SERVER_AUTH_URL');

        const request = this.httpService
            .get<TokensDto>(`${url}/login/get_tokens`, {
                params: {
                    username: username,
                    password: password,
                },
            })
            .pipe(map((res) => {
                console.log('--- data = ', res.data);
                return res;
            }))
            .pipe(catchError((err) => {
                throw new ForbiddenException('API not available');
            }));

        const result = await lastValueFrom(request);
        return result.data;
    }

    async getUser(username: string, accessToken: string) {

        const url = this.configService.get('SERVER_AUTH_URL');

        const request = this.httpService
            .get(`${url}/login/get_user`, {
                params: {
                    username: username,
                },
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
            })
            .pipe(catchError((err) => {
                throw new ForbiddenException('API not available');
            }));

        const result = await lastValueFrom(request);
        return result.data;
    }

    async registerUser(username: string, password: string) {

        const url = this.configService.get('SERVER_AUTH_URL');

        const request = this.httpService
            .post(`${url}/login/register_user`,
                `username=${username}&password=${password}`,
            )
            .pipe(map((res) => {
                console.log('--- registerUser --- data = ', res.data);
                return res;
            }))
            .pipe(catchError((err) => {
                throw new ForbiddenException('API not available');
            }));

        const result = await lastValueFrom(request);
        return result.data;
    }

    async logoutUser(access_token: string, refresh_token: string) {
        const url = this.configService.get('SERVER_AUTH_URL');

        const request = this.httpService
            .post(`${url}/login/logout_user`,
                `access_token=${access_token}&refresh_token=${refresh_token}`,
                {
                    headers: { 'Authorization': 'Bearer ' + access_token }
                }
            )
            .pipe(map((res) => {
                console.log('--- logoutUser --- data = ', res.data);
                return res;
            }))
            .pipe(catchError((err) => {
                throw new ForbiddenException('API not available');
            }));

        const result = await lastValueFrom(request);
        return result.data;
    }

    async updateTokens(refresh_token: string) {
        const url = this.configService.get('SERVER_AUTH_URL');

        const request = this.httpService
            .get<TokensDto>(`${url}/login/update_tokens`, {
                params: {
                    refresh_token: refresh_token,
                },
            })
            .pipe(map((res) => {
                console.log('--- data = ', res.data);
                return res;
            }))
            .pipe(catchError((err) => {
                throw new ForbiddenException('API not available');
            }));

        const result = await lastValueFrom(request);
        return result.data;
    }

    async updateUserTokens(result: UserAuthDto) {

        const current = UserAuthDto.getCurrentClient(result);
        if (current) {

            const dateNow = Date.now();
            if (current.update + current.ttl > dateNow) {
                return await this.updateTokens(current.rt);
            }
        }
        return null;
    }
}

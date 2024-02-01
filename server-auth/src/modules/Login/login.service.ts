import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable, catchError, map, lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
// 
import { AccessCodeResponseDto } from './dto/access-code-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginFormDto } from './dto/login-form.dto';

//
@Injectable()
export class LoginService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    //  curl --location 'http://localhost:8080/realms/citizen-network/protocol/openid-connect/auth?response_type=code&client_id=nest-app&state=sidyuf8skf32nd&scope=openid%20profile&redirect_uri=http%3A%2F%2Flocalhost%3A3030%2Flogin%2Fredirect_uri'
    async getLoginForm() {

        const request = this.httpService
            .get<LoginFormDto>(
                'http://localhost:8080/realms/citizen-network/protocol/openid-connect/auth', {
                params: {
                    response_type: 'code',
                    client_id: this.configService.get('CLIENT_ID'),
                    state: this.configService.get('STATE'),
                    scope: this.configService.get('SCOPE'),
                    redirect_uri: this.configService.get('REDIRECT_URI'),
                },
            })
            .pipe(map((res) => {
                const url = new URL(res.data.loginAction.replace(/&amp;/g, "&"));
                return new AuthResponseDto(url, res.headers["set-cookie"]);
            }))
            .pipe(catchError((err) => {
                throw new ForbiddenException('API not available');
            }));

        const fact = await lastValueFrom(request);

        return fact;
    }

    async postForm(username: string, password: string, auth: AuthResponseDto) {

        console.log('---------- data for Postman');
        console.log('session_code = ', auth.url.searchParams.get('session_code'));
        console.log('execution = ', auth.url.searchParams.get('execution'));
        console.log('tab_id = ', auth.url.searchParams.get('tab_id'));
        console.log('auth.cookies[0] = ', auth.cookies[0]);
        console.log('auth.cookies[1] = ', auth.cookies[1]);
        console.log('auth.cookies[2] = ', auth.cookies[2]);
        console.log('----------');

        const request = this.httpService
            .post<AccessCodeResponseDto>(
                'http://localhost:8080/realms/citizen-network/login-actions/authenticate',
                `username=${username}&password=${password}&credentialId=`, {
                params: {
                    session_code: auth.url.searchParams.get('session_code'),
                    execution: auth.url.searchParams.get('execution'),
                    client_id: auth.url.searchParams.get('client_id'),
                    tab_id: auth.url.searchParams.get('tab_id'),
                },
                headers: {
                    'Cookie': auth.cookies,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .pipe(map((res) => {
                console.log('--- postForm --- ', res.data);
                return res.data;
            }))
            .pipe(catchError((err) => {
                //if (err.response.data) console.log(err.response.data);
                throw new ForbiddenException('API not available');
            }));

        const fact = await lastValueFrom(request);

        return fact;
    }

    async getAccessData(code: string) {

        const request = this.httpService
            .post(
                'http://localhost:8080/realms/citizen-network/protocol/openid-connect/token',
                {
                    grant_type: 'authorization_code',
                    client_id: this.configService.get('CLIENT_ID'),
                    client_secret: this.configService.get('CLIENT_SECRET'),
                    code: code,
                    redirect_uri: 'http://localhost:3030/login/redirect_uri',
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
            .pipe(map((res) => {
                console.log('--- getAccessData --- ', res.data);
                return new AccessCodeResponseDto(res.data);
            }))
            .pipe(catchError((err) => {
                throw new ForbiddenException('API not available');
            }));

        const fact = await lastValueFrom(request);

        return fact;
    }

    //      curl -L -X POST "http://localhost:8080/realms/citizen-network/protocol/openid-connect/token" 
    //          -H 'Content-Type: application/x-www-form-urlencoded' 
    //          --data-urlencode 'grant_type=refresh_token' 
    //          --data-urlencode 'client_id=nest-app' 
    //          --data-urlencode 'refresh_token=...' 
    //          --data-urlencode 'client_secret=...'
    async updateToken(refreshToken: string) {

        const request = this.httpService
            .post<AccessCodeResponseDto>(
                'http://localhost:8080/realms/citizen-network/protocol/openid-connect/token',
                {
                    grant_type: 'refresh_token',
                    client_id: this.configService.get('CLIENT_ID'),
                    client_secret: this.configService.get('CLIENT_SECRET'),
                    refresh_token: refreshToken,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
            .pipe(map((res) => {
                console.log('--- new access_tokeb --- ', res.data);
                return new AccessCodeResponseDto(res.data);
            }))
            .pipe(catchError((err) => {
                throw new ForbiddenException('API not available');
            }));

        const fact = await lastValueFrom(request);

        return fact;
    }
}

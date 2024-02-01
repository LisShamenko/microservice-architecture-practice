import { Controller, Get, Inject, Query, Req, Res } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Resource, Unprotected } from "nest-keycloak-connect";
import { Response, Request } from 'express';
//
import { LoginService } from './login.service';
import { AccessCodeResponseDto } from './dto/access-code-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

// 
@Controller('login')
@Resource('login')
export class LoginController {
    constructor(
        private readonly loginService: LoginService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.log('info', { message: "--- LoginController --- " });
    }

    //  curl --location 'http://localhost:3030/login/get_tokens?username=user1&password=user1'
    @Get('get_tokens')
    @Unprotected()
    async getAccessToken(
        @Query('username') username: string,
        @Query('password') password: string,
        @Req() req: Request, @Res() res: Response,
    ) {
        const authResponse: AuthResponseDto =
            await this.loginService.getLoginForm();
        const result_code: AccessCodeResponseDto =
            await this.loginService.postForm(username, password, authResponse);
        res.send(result_code);
    }

    @Get('redirect_uri')
    @Unprotected()
    async redirectUri(
        @Query('code') code: string,
        @Query('session_state') session_state: string,
        @Query('state') state: string,
    ) {
        return await this.loginService.getAccessData(code);
    }

    //  curl --location 'http://localhost:3030/login/update_tokens?refresh_token=...'
    @Get('update_tokens')
    @Unprotected()
    async updateAccessToken(
        @Query('refresh_token') refreshToken: string,
        @Req() req: Request, @Res() res: Response,
    ) {
        const result_code: AccessCodeResponseDto =
            await this.loginService.updateToken(refreshToken);
        res.send(result_code);
    }
}

import { BadRequestException, Body, Controller, Get, Inject, Post, Query, Req, Res } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Resource, Unprotected, Roles } from "nest-keycloak-connect";
import { Response, Request } from 'express';
//
import { LoginService } from './login.service';
import { AccessCodeResponseDto } from './dto/access-code-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { KeycloakService } from '../Keycloak/keycloak.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TokensDto } from './dto/tokens.dto';



// 
@Controller('login')
@Resource('login')
export class LoginController {
    constructor(
        private readonly keycloakService: KeycloakService,
        private readonly loginService: LoginService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        this.logger.log('info', { message: "--- LoginController --- " });
    }

    // curl --location 'http://localhost:3030/login/register_user' \
    //      --header 'Content-Type: application/x-www-form-urlencoded' \
    //      --data-urlencode 'username=user77' \
    //      --data-urlencode 'password=123456'
    @Post('register_user') @Unprotected()
    async registerUser(@Body() userDto: CreateUserDto, @Res() res: Response) {
        const result = await this.keycloakService
            .createUser(userDto.username, userDto.password);
        res.send(result);
    }

    //  curl --location 'http://localhost:3030/login/get_tokens?username=user1&password=user1'
    @Get('get_tokens') @Unprotected()
    async getAccessToken(
        @Query('username') username: string,
        @Query('password') password: string,
        @Req() req: Request, @Res() res: Response,
    ) {
        const authResponse: AuthResponseDto =
            await this.loginService.getLoginForm();
        const result_code: AccessCodeResponseDto =
            await this.loginService.postForm(username, password, authResponse);
        res.status(200).send(result_code);
    }

    @Get('redirect_uri') @Unprotected()
    async redirectUri(
        @Query('code') code: string,
        @Query('session_state') session_state: string,
        @Query('state') state: string,
    ) {
        return await this.loginService.getAccessData(code);
    }

    //  curl --location 'http://localhost:3030/login/update_tokens?refresh_token=...'
    @Get('update_tokens') @Unprotected()
    async updateAccessToken(
        @Query('refresh_token') refreshToken: string,
        @Req() req: Request, @Res() res: Response,
    ) {
        const result_code: AccessCodeResponseDto =
            await this.loginService.updateToken(refreshToken);
        res.send(result_code);
    }

    @Get('get_user')
    async getUser(@Query('username') username: string, @Res() res: Response) {
        const result = await this.keycloakService.getUser(username);
        if (result && result.length > 0) {
            res.send({
                id: result[0].id,
                username: result[0].username,
            });
        }
        else {
            throw new BadRequestException('user is missing');
        }
    }

    @Post('logout_user')
    async logoutUser(@Body() tokens: TokensDto, @Res() res: Response) {
        const result = await this.loginService
            .logoutUser(tokens.access_token, tokens.refresh_token);
        res.send(result);
    }

    // 
    @Get('check') @Roles({ roles: ['user'] })
    async getInfo() { return 'ok'; }
}

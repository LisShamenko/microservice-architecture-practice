import { Body, Controller, Get, Inject, Post, Query, Res, UnauthorizedException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
//
import { LoginService } from './login.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RedisRepository } from '../RedisClient/redis.repository';
import { UserAuthDto } from '../RedisClient/dto/user-auth.dto';
import { ClientDto } from '../RedisClient/dto/client.dto';
import { TokensDto } from './dto/tokens.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';




// 
@Controller('auth')
export class LoginController {
    saltOrRounds: number = 10;

    constructor(
        private readonly loginService: LoginService,
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @Inject(RedisRepository) private repository: RedisRepository,
    ) {
        this.logger.log('info', { message: "--- LoginController --- " });
    }



    // 
    @Get('user')
    async getUser(
        @Query('username') username: string,
        @Query('access_token') accessToken: string,
        @Res() res: Response,
    ) {
        const result = await this.loginService.getUser(username, accessToken);
        res.send(result);
    }

    // 
    @Post('login')
    async loginUser(@Body() dto: LoginUserDto, @Res() res: Response) {

        const clientName = this.configService.get('CLIENT_NAME');

        // 
        let userAuth = await this.repository.getAuth(dto.username);
        if (!userAuth) {

            const dateNow = Date.now();
            const tokens = await this.loginService.loginUser(dto.username, dto.password);
            userAuth = await this.createClient(
                clientName, userAuth,
                tokens, dateNow,
                dto.username, dto.password
            );

            await this.repository.saveAuth(dto.username, userAuth);
            return res.send(TokensDto.getSendObject(tokens, dateNow));
        }

        // REFACTORING - если изменить пароль, то redis будет содержать не верный hash
        const isMatch = await bcrypt.compare(dto.password, userAuth.hash);
        if (!isMatch) {
            throw new UnauthorizedException('Incorrect password!');
        }

        // 
        let tokens: TokensDto = null;
        const dateNow = Date.now();
        const current = UserAuthDto.getCurrentClient(userAuth);
        if (current && current.update + current.ttl > dateNow) {
            tokens = await this.loginService.updateTokens(current.rt);
        }
        else {
            tokens = await this.loginService.loginUser(dto.username, dto.password);
        }

        // 
        this.updateClient(clientName, userAuth, tokens, dateNow);
        await this.repository.saveAuth(dto.username, userAuth);
        return res.send(TokensDto.getSendObject(tokens, dateNow));
    }

    @Post('register')
    async registerUser(@Body() dto: RegisterUserDto, @Res() res: Response) {

        const result = await this.loginService.registerUser(
            dto.username, dto.password
        );

        const userAuth = new UserAuthDto();
        userAuth.user = dto.username;
        userAuth.hash = await bcrypt.hash(dto.password, this.saltOrRounds);
        userAuth.clients = [];
        userAuth.current = '';
        await this.repository.saveAuth(dto.username, userAuth);

        res.send(result);
    }

    @Post('logout')
    async logoutUser(@Body() dto: LogoutUserDto, @Res() res: Response) {

        const userAuth = await this.repository.getAuth(dto.username);
        if (!userAuth) {
            throw new UnauthorizedException('Incorrect data!');
        }

        const clientName = this.configService.get('CLIENT_NAME');
        const client = UserAuthDto.getClient(userAuth, clientName);
        if (!client || client.at !== dto.accessToken) {
            throw new UnauthorizedException('Incorrect data!');
        }

        const current = UserAuthDto.getCurrentClient(userAuth);
        const result = await this.loginService.logoutUser(current.at, current.rt);
        res.send(result);
    }

    @Post('update')
    async updateToken(@Body() dto: UpdateUserDto, @Res() res: Response) {

        const clientName = this.configService.get('CLIENT_NAME');

        const userAuth = await this.repository.getAuth(dto.username);
        if (!userAuth) {
            throw new UnauthorizedException('Incorrect data!');
        }

        const client = UserAuthDto.getClient(userAuth, clientName);
        if (!client || client.at !== dto.accessToken) {
            if (dto.update < client.update)
                return res.send({ update: null });
            else
                throw new UnauthorizedException('Incorrect data!');
        }

        // 
        let tokens: TokensDto = null;
        const dateNow = Date.now();
        const current = UserAuthDto.getCurrentClient(userAuth);
        if (current && current.update + current.ttl > dateNow) {
            tokens = await this.loginService.updateTokens(current.rt);
        }
        else {
            throw new UnauthorizedException('Token expired!');
        }

        // 
        this.updateClient(clientName, userAuth, tokens, dateNow);
        await this.repository.saveAuth(dto.username, userAuth);
        return res.send(TokensDto.getSendObject(tokens, dateNow));
    }

    // 
    async createClient(
        clientName: string, userAuth: UserAuthDto,
        tokens: TokensDto, dateNow: number,
        username: string, password: string,
    ) {
        const client = new ClientDto();
        client.name = clientName;
        client.ttl = 60 * 60 * 24 * 1000;
        client.at = tokens.accessToken;
        client.rt = tokens.refreshToken;
        client.update = dateNow;

        userAuth = new UserAuthDto();
        userAuth.user = username;
        userAuth.hash = await bcrypt.hash(password, this.saltOrRounds);
        userAuth.clients = [client];
        userAuth.current = clientName;

        return userAuth;
    }

    updateClient(
        clientName: string, userAuth: UserAuthDto,
        tokens: TokensDto, dateNow: number,
    ) {

        let client: ClientDto = UserAuthDto.getClient(userAuth, clientName);
        if (client) {
            client.at = tokens.accessToken;
            client.rt = tokens.refreshToken;
            client.update = dateNow;
        }
        else {
            client = new ClientDto();
            client.name = clientName;
            client.ttl = 60 * 60 * 24 * 1000;
            client.at = tokens.accessToken;
            client.rt = tokens.refreshToken;
            client.update = dateNow;
            userAuth.clients.push(client);
        }
        userAuth.current = clientName;
    }
}

import { Body, Controller, Inject, Post, Res, UnauthorizedException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
//
import { LoginService } from './login.service';
import { RedisRepository } from '../RedisClient/redis.repository';
import { UserAuthDto } from '../RedisClient/dto/user-auth.dto';
import { ClientDto } from '../RedisClient/dto/client.dto';
import { TokensDto } from './dto/tokens.dto';
import { UpdateUserDto } from './dto/update-user.dto';



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
    @Post('update')
    async updateToken(@Body() dto: UpdateUserDto, @Res() res: Response) {

        const clientName = this.configService.get('CLIENT_NAME');

        const userAuth = await this.repository.getAuth(dto.username);
        if (!userAuth) {
            throw new UnauthorizedException('Incorrect data!');
        }

        // 
        let tokens: TokensDto = null;
        let dateNow = Date.now();
        const current = UserAuthDto.getCurrentClient(userAuth);
        const client = UserAuthDto.getClient(userAuth, clientName);
        if (current) {

            if (client) {
                if (client.at !== dto.accessToken) {
                    throw new UnauthorizedException('Incorrect data!');
                }
            }
            else {
                if (current.at !== dto.accessToken) {
                    throw new UnauthorizedException('Incorrect data!');
                }
            }

            // 
            if (current.update + current.ttl > dateNow) {
                dateNow = current.update;
                tokens = {
                    accessToken: current.at,
                    refreshToken: current.rt,
                } as TokensDto;
            }
            else {
                tokens = await this.loginService.updateTokens(current.rt);
            }
        }
        else {
            // !client || client.at !== dto.accessToken
            throw new UnauthorizedException('Incorrect data!');
        }

        // 
        this.updateClient(clientName, userAuth, tokens, dateNow);
        await this.repository.saveAuth(dto.username, userAuth);
        return res.send(TokensDto.getSendObject(tokens, dateNow));
    }

    // 
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

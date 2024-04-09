import { ForbiddenException, Injectable } from '@nestjs/common';
import { catchError, map, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
// 
import { TokensDto } from './dto/tokens.dto';



//
@Injectable()
export class LoginService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    // 
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
}

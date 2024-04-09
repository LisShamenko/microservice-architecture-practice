
export class TokensDto {
    accessToken: string;
    refreshToken: string;

    static getSendObject(tokens: TokensDto, update: number) {
        return {
            accessToken: tokens.accessToken,
            update: update,
        }
    }
}

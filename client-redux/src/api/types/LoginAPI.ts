
// 
export type TokensDto = {
    accessToken: string;
}

export type UserDto = {
    id: string;
    username: string;
}

export type RejectFunc = (error: any) => any;

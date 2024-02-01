
export class AuthResponseDto {
    url: URL;
    cookies: string[];
    constructor(url: URL, cookies: string[]) {
        this.url = url;
        this.cookies = cookies;
    }
}


export class AccessCodeResponseDto {
    accessToken: string;
    refreshToken: string;
    /**
     * @param data - data from URL: *realms/<...>/protocol/openid-connect/token*
     * - access_token
     * - expires_in
     * - refresh_expires_in
     * - refresh_token
     * - token_type
     * - id_token
     * - not-before-policy
     * - session_state
     * - scope
     */
    constructor(data: any) {
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
    }
}

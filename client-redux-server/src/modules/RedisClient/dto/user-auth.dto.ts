import { ClientDto } from "./client.dto";

export class UserAuthDto {
    user: string;
    hash: string;
    clients: ClientDto[];
    current: string;

    static getCurrentClient(dto: UserAuthDto) {
        return dto.clients.find(v => v.name === dto.current);
    }

    static getClient(dto: UserAuthDto, clientName: string) {
        return dto.clients.find(v => v.name === clientName);
    }
}

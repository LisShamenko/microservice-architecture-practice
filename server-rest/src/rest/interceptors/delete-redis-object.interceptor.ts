import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, UseInterceptors } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { RedisRepository } from "../../modules/RedisClient/redis.repository";
import { Prefix } from "../enums/prefix.enum";



// 
function getPrefixByUrl(url: string) {
    if (url.startsWith(Prefix.enemy)) return Prefix.enemy;
    if (url.startsWith(Prefix.game)) return Prefix.game;
    if (url.startsWith(Prefix.template)) return Prefix.template;
    if (url.startsWith(Prefix.map)) return Prefix.map;
    if (url.startsWith(Prefix.player)) return Prefix.player;
    if (url.startsWith(Prefix.product)) return Prefix.product;
    if (url.startsWith(Prefix.spawnScript)) return Prefix.spawnScript;
    if (url.startsWith(Prefix.skill)) return Prefix.skill;
    return Prefix.none;
}

export function DeleteRedisObject(
    repository: RedisRepository,
    context: ExecutionContext,
    next: CallHandler,
): Observable<any> {
    const args = context.getArgs();
    const id = args[0].params.id;
    const urlPrefix = args[0].originalUrl.replace('/', '');
    const prefix = getPrefixByUrl(urlPrefix);
    return next.handle().pipe(
        tap(() => {
            if (id) repository.deleteObjectWithList(prefix, id);
            else repository.deleteList(prefix);
        }),
    );
}

// 
@Injectable()
export class DeleteRedisObjectInterceptor implements NestInterceptor {
    constructor(@Inject(RedisRepository) private repository: RedisRepository) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return DeleteRedisObject(this.repository, context, next);
    }
}

export function DeleteRedis() {
    return UseInterceptors(DeleteRedisObjectInterceptor);
}

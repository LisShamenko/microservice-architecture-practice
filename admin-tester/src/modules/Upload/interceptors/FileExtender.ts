import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from 'rxjs';

// 
@Injectable()
export class FileExtender implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        req.file['comment'] = req.body.comment;
        return next.handle();
    }
}

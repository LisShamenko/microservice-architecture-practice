import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

// 
@Injectable()
export class ErrorHelper {

    /**
     * @example
     * this.errorHelper.foundError(tmp, 'level_template_id');
     */
    foundError(obj: Object, name: string) {
        if (obj) return;
        throw new NotFoundException({ error: `${name} not found` });
    }

    /**
     * @example
     * this.errorHelper.foundArrayError(enemies, 'enemy_ids');
     */
    foundArrayError(obj: Object[], name: string) {
        if (obj && obj.length > 0) return;
        throw new NotFoundException({ error: `${name} not found` });
    }

    /**
     * @example
     * this.errorHelper.transactionError(err.message);
     */
    transactionError(message: string) {
        throw new BadRequestException({ error: `transaction: ${message}` });
    }

    /**
     * @example
     * this.errorHelper.deleteError(err.message);
     */
    deleteError(message: string) {
        throw new BadRequestException({ error: `delete: ${message}` });
    }

    /**
     * @example
     * if (player.game) {
     *     this.errorHelper.logicalError('player already created game');
     * }
     */
    logicalError(message: string) {
        throw new BadRequestException({ error: `logical: ${message}` });
    }
}

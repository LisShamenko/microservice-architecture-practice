import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

// 
@Injectable()
export class ErrorHelper {

    /**
     * @example
     * this.errorHelper.foundError(tmp, 'level_template_id');
     */
    foundError(obj: Object, name: string) {
        if (obj) return;
        throw new HttpException({ error: `${name} not found` },
            HttpStatus.NOT_FOUND);
    }

    /**
     * @example
     * this.errorHelper.foundArrayError(enemies, 'enemy_ids');
     */
    foundArrayError(obj: Object[], name: string) {
        if (obj && obj.length > 0) return;
        throw new HttpException({ error: `${name} not found` },
            HttpStatus.NOT_FOUND);
    }

    /**
     * @example
     * this.errorHelper.transactionError(err.message);
     */
    transactionError(message: string) {
        throw new HttpException({ error: `transaction: ${message}` },
            HttpStatus.BAD_REQUEST);
    }

    /**
     * @example
     * this.errorHelper.deleteError(err.message);
     */
    deleteError(message: string) {
        throw new HttpException({ error: `delete: ${message}` },
            HttpStatus.BAD_REQUEST);
    }

    /**
     * @example
     * if (player.game) {
     *     this.errorHelper.logicalError('player already created game');
     * }
     */
    logicalError(message: string) {
        throw new HttpException({ error: `logical: ${message}` },
            HttpStatus.BAD_REQUEST);
    }
}

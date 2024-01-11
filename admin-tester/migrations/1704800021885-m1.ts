import { MigrationInterface, QueryRunner } from "typeorm"

export class M11704800021885 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "post" RENAME COLUMN "title" TO "name"`,
        )
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "post" RENAME COLUMN "name" TO "title"`,
        )
    }

}

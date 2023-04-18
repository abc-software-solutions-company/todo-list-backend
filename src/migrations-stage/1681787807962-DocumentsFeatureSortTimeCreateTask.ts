import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentsFeatureSortTimeCreateTask1681787807962 implements MigrationInterface {
    name = 'DocumentsFeatureSortTimeCreateTask1681787807962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist_stage"."document" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist_stage"."document" DROP COLUMN "createdAt"`);
    }

}

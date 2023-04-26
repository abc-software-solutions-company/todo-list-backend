import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMissingIsActiveAndCreatedDateOnDocuments1682492571935 implements MigrationInterface {
    name = 'FixMissingIsActiveAndCreatedDateOnDocuments1682492571935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."document" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "todolist"."document" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."document" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "todolist"."document" DROP COLUMN "createdAt"`);
    }

}

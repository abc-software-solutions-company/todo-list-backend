import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentDeleteFeature1681721163670 implements MigrationInterface {
    name = 'DocumentDeleteFeature1681721163670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist_stage"."document" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist_stage"."document" DROP COLUMN "isActive"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1691997029249 implements MigrationInterface {
    name = 'Migrations1691997029249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "favorite"`);
        await queryRunner.query(`ALTER TABLE "document" ADD "favorite" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "favorite"`);
        await queryRunner.query(`ALTER TABLE "document" ADD "favorite" TIMESTAMP`);
    }

}

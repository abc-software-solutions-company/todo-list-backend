import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexColumnForTask1672889321467 implements MigrationInterface {
    name = 'AddIndexColumnForTask1672889321467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "indexColumn" bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "indexColumn"`);
    }

}

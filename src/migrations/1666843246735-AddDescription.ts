import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescription1666843246735 implements MigrationInterface {
    name = 'AddDescription1666843246735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "description"`);
    }

}

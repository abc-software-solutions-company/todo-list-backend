import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVisibility1666592906765 implements MigrationInterface {
    name = 'AddVisibility1666592906765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" ADD "visibility" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP COLUMN "visibility"`);
    }

}

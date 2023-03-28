import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeautureTaskSymbol1679995251489 implements MigrationInterface {
    name = 'AddFeautureTaskSymbol1679995251489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" ADD "taskSymbol" character varying`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "order" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP COLUMN "taskSymbol"`);
    }

}

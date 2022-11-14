import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStartDueDate1668410576494 implements MigrationInterface {
    name = 'AddStartDueDate1668410576494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "startDate" TIMESTAMP NOT NULL DEFAULT '"2022-11-14T07:22:58.917Z"'`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "dueDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "dueDate"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "startDate"`);
    }

}

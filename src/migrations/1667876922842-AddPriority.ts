import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPriority1667876922842 implements MigrationInterface {
    name = 'AddPriority1667876922842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "priority" character varying NOT NULL DEFAULT 'Medium'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "priority"`);
    }

}

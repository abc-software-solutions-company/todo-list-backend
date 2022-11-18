import { MigrationInterface, QueryRunner } from "typeorm";

export class Assignee1668763125277 implements MigrationInterface {
    name = 'Assignee1668763125277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "assigneeId" uuid`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ALTER COLUMN "startDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ALTER COLUMN "startDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD CONSTRAINT "FK_7384988f7eeb777e44802a0baca" FOREIGN KEY ("assigneeId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP CONSTRAINT "FK_7384988f7eeb777e44802a0baca"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ALTER COLUMN "startDate" SET DEFAULT '2022-11-14 07:22:58.917'`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ALTER COLUMN "startDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "assigneeId"`);
    }

}

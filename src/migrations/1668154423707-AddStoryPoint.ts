import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoryPoint1668154423707 implements MigrationInterface {
    name = 'AddStoryPoint1668154423707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "storyPoint" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "storyPoint"`);
    }

}

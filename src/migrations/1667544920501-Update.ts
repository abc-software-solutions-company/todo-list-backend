import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1667544920501 implements MigrationInterface {
    name = 'Update1667544920501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."status" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "todolist"."favorite" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "todolist"."attachment" ALTER COLUMN "name" SET DEFAULT 'attachment'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."attachment" ALTER COLUMN "name" SET DEFAULT 'Attachment'`);
        await queryRunner.query(`ALTER TABLE "todolist"."favorite" ALTER COLUMN "isActive" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "todolist"."status" DROP COLUMN "isActive"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVisibility1666593464031 implements MigrationInterface {
    name = 'AddVisibility1666593464031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" ALTER COLUMN "visibility" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" ALTER COLUMN "visibility" DROP NOT NULL`);
    }

}

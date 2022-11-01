import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImage1667274792829 implements MigrationInterface {
    name = 'AddImage1667274792829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."image" ADD "name" character varying NOT NULL DEFAULT 'Image'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."image" DROP COLUMN "name"`);
    }

}

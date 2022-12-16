import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatus1666328125440 implements MigrationInterface {
  name = 'AddStatus1666328125440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."status" ADD "color" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "todolist"."status" ADD "index" bigint NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."status" DROP COLUMN "index"`);
    await queryRunner.query(`ALTER TABLE "todolist"."status" DROP COLUMN "color"`);
  }
}

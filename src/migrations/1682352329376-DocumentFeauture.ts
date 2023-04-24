import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentFeauture1682352329376 implements MigrationInterface {
  name = 'DocumentFeauture1682352329376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "isFeature" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "isFeature"`);
  }
}

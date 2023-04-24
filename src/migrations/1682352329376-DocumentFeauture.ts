import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentFeauture1682352329376 implements MigrationInterface {
  name = 'DocumentFeauture1682352329376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "isFeature" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(
      `ALTER TABLE "todolist"."document" ADD CONSTRAINT "FK_0f10c2404755fd85c4cfa5f61be" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."document" ADD CONSTRAINT "FK_4c4ae8a7a98116d84d0ecb087b9" FOREIGN KEY ("parentId") REFERENCES "todolist"."document"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."document" DROP CONSTRAINT "FK_4c4ae8a7a98116d84d0ecb087b9"`);
    await queryRunner.query(`ALTER TABLE "todolist"."document" DROP CONSTRAINT "FK_0f10c2404755fd85c4cfa5f61be"`);
    await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "isFeature"`);
    await queryRunner.query(`DROP TABLE "todolist"."document"`);
  }
}

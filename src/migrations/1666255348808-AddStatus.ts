import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatus1666255348808 implements MigrationInterface {
  name = 'AddStatus1666255348808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "status" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "todoListId" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "task" ADD "statusId" bigint NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "status" DROP CONSTRAINT "FK_65c210de03af91ae2c8c520549b"`);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "statusId"`);
    await queryRunner.query(`DROP TABLE "status"`);
  }
}

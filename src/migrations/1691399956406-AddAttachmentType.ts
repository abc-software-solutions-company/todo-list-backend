import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttachmentType1691399956406 implements MigrationInterface {
  name = 'AddAttachmentType1691399956406';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todolist"."attachment" ADD "type" character varying NOT NULL DEFAULT 'image'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."attachment" DROP COLUMN "type"`);
  }
}

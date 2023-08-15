import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFavoriteToNumber1692063961596 implements MigrationInterface {
  name = 'ChangeFavoriteToNumber1692063961596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "favorite"`);
    await queryRunner.query(`ALTER TABLE "document" ADD "favorite" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "favorite"`);
    await queryRunner.query(`ALTER TABLE "attachment" DROP COLUMN "type"`);
  }
}

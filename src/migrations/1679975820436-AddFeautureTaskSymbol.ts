import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeautureTaskSymbol1679975820436 implements MigrationInterface {
  name = 'AddFeautureTaskSymbol1679975820436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."todolist" ADD "taskSymbol" character varying`);
    await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "order" integer`);
    await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2"`);
    await queryRunner.query(`ALTER TABLE "todolist"."task" DROP CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b"`);
    await queryRunner.query(`ALTER TABLE "todolist"."favorite" DROP CONSTRAINT "FK_d869ad56091727f8e746967bfe0"`);
    await queryRunner.query(`ALTER TABLE "todolist"."todolist_user" DROP CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc"`);
    await queryRunner.query(`ALTER TABLE "todolist"."status" DROP CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729"`);
    await queryRunner.query(
      `ALTER TABLE "todolist"."todolist" ADD CONSTRAINT "UQ_ad126e5bdbcae6306ea2266a1f2" UNIQUE ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."favorite" ADD CONSTRAINT "FK_d869ad56091727f8e746967bfe0" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."status" ADD CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."todolist_user" ADD CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."todolist" ADD CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2" FOREIGN KEY ("id") REFERENCES "todolist"."pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."task" ADD CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."task" DROP CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b"`);
    await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2"`);
    await queryRunner.query(`ALTER TABLE "todolist"."todolist_user" DROP CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc"`);
    await queryRunner.query(`ALTER TABLE "todolist"."status" DROP CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729"`);
    await queryRunner.query(`ALTER TABLE "todolist"."favorite" DROP CONSTRAINT "FK_d869ad56091727f8e746967bfe0"`);
    await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP CONSTRAINT "UQ_ad126e5bdbcae6306ea2266a1f2"`);
    await queryRunner.query(
      `ALTER TABLE "todolist"."status" ADD CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."todolist_user" ADD CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."favorite" ADD CONSTRAINT "FK_d869ad56091727f8e746967bfe0" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."task" ADD CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."todolist" ADD CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2" FOREIGN KEY ("id") REFERENCES "todolist"."pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "order"`);
    await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP COLUMN "taskSymbol"`);
  }
}

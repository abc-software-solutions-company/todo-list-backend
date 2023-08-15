import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelatedTasks1691978075378 implements MigrationInterface {
  name = 'AddRelatedTasks1691978075378';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "todolist"."related_tasks" ("taskId_1" character varying NOT NULL, "taskId_2" character varying NOT NULL, CONSTRAINT "PK_8ae3ea3da939e8549bcc9630e0f" PRIMARY KEY ("taskId_1", "taskId_2"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e435d72349632b084f52547aa8" ON "todolist"."related_tasks" ("taskId_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_efea502d803086848efddd18e7" ON "todolist"."related_tasks" ("taskId_2") `,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."related_tasks" ADD CONSTRAINT "FK_e435d72349632b084f52547aa88" FOREIGN KEY ("taskId_1") REFERENCES "todolist"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "todolist"."related_tasks" ADD CONSTRAINT "FK_efea502d803086848efddd18e77" FOREIGN KEY ("taskId_2") REFERENCES "todolist"."task"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."related_tasks" DROP CONSTRAINT "FK_efea502d803086848efddd18e77"`);
    await queryRunner.query(`ALTER TABLE "todolist"."related_tasks" DROP CONSTRAINT "FK_e435d72349632b084f52547aa88"`);
    await queryRunner.query(`DROP INDEX "todolist"."IDX_efea502d803086848efddd18e7"`);
    await queryRunner.query(`DROP INDEX "todolist"."IDX_e435d72349632b084f52547aa8"`);
    await queryRunner.query(`DROP TABLE "todolist"."related_tasks"`);
  }
}

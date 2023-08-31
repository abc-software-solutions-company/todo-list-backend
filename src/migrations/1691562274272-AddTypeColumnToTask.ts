import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeColumnToTask1691562274272 implements MigrationInterface {
  name = 'AddTypeColumnToTask1691562274272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "todolist"."task_type_enum" AS ENUM('Task', 'Story', 'Bug', 'Sub-task')`);
    await queryRunner.query(
      `ALTER TABLE "todolist"."task" ADD "type" "todolist"."task_type_enum" NOT NULL DEFAULT 'Task'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "todolist"."public"."task_type_enum"`);
  }
}

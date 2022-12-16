import { MigrationInterface, QueryRunner } from "typeorm";

export class Assignee1668997437092 implements MigrationInterface {
    name = 'Assignee1668997437092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todolist"."task_user" ("taskId" character varying NOT NULL, "userId" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dd5a20f7313af9581ab8c30cfc6" PRIMARY KEY ("taskId", "userId"))`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ALTER COLUMN "startDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "todolist"."task_user" ADD CONSTRAINT "FK_ff099dc6756bfef736ebe18ea9a" FOREIGN KEY ("taskId") REFERENCES "todolist"."task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."task_user" ADD CONSTRAINT "FK_0f500c19a4a119f22a82c9b3640" FOREIGN KEY ("userId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task_user" DROP CONSTRAINT "FK_0f500c19a4a119f22a82c9b3640"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task_user" DROP CONSTRAINT "FK_ff099dc6756bfef736ebe18ea9a"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ALTER COLUMN "startDate" SET DEFAULT '2022-11-14 07:22:58.917'`);
        await queryRunner.query(`DROP TABLE "todolist"."task_user"`);
    }

}

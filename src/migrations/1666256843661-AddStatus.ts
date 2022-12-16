import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatus1666256843661 implements MigrationInterface {
    name = 'AddStatus1666256843661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP CONSTRAINT "fk_todolist_user"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP CONSTRAINT "fk_task_user"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP CONSTRAINT "FK_ed2187c496930a6950777fd8f6d"`);
        await queryRunner.query(`CREATE TABLE "todolist"."status" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "todoListId" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "statusId" bigint`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2"`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" ADD CONSTRAINT "UQ_ad126e5bdbcae6306ea2266a1f2" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ALTER COLUMN "index" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" ADD CONSTRAINT "FK_02f35567d303922800cac486cd4" FOREIGN KEY ("userId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" ADD CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2" FOREIGN KEY ("id") REFERENCES "todolist"."pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD CONSTRAINT "FK_ed2187c496930a6950777fd8f6d" FOREIGN KEY ("todoListId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c" FOREIGN KEY ("statusId") REFERENCES "todolist"."status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."status" ADD CONSTRAINT "FK_65c210de03af91ae2c8c520549b" FOREIGN KEY ("todoListId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."status" DROP CONSTRAINT "FK_65c210de03af91ae2c8c520549b"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP CONSTRAINT "FK_ed2187c496930a6950777fd8f6d"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2"`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP CONSTRAINT "FK_02f35567d303922800cac486cd4"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ALTER COLUMN "index" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" DROP CONSTRAINT "UQ_ad126e5bdbcae6306ea2266a1f2"`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" ADD CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2" FOREIGN KEY ("id") REFERENCES "todolist"."pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "statusId"`);
        await queryRunner.query(`DROP TABLE "todolist"."status"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD CONSTRAINT "FK_ed2187c496930a6950777fd8f6d" FOREIGN KEY ("todoListId") REFERENCES "todolist"."todolist"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD CONSTRAINT "fk_task_user" FOREIGN KEY ("userId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist" ADD CONSTRAINT "fk_todolist_user" FOREIGN KEY ("userId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

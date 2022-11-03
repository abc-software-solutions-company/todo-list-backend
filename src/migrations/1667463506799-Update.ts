import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1667463506799 implements MigrationInterface {
    name = 'Update1667463506799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."status" DROP CONSTRAINT "FK_65c210de03af91ae2c8c520549b"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP CONSTRAINT "FK_ed2187c496930a6950777fd8f6d"`);
        await queryRunner.query(`ALTER TABLE "todolist"."status" RENAME COLUMN "todoListId" TO "todolistId"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" RENAME COLUMN "todoListId" TO "todolistId"`);
        await queryRunner.query(`CREATE TABLE "todolist"."task_attachment" ("taskId" character varying NOT NULL, "attachmentId" bigint NOT NULL, "isActive" boolean NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a220596f80676d6909556937edb" PRIMARY KEY ("taskId", "attachmentId"))`);
        await queryRunner.query(`CREATE TABLE "todolist"."attachment" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL DEFAULT 'Attachment', "link" text NOT NULL, "isActive" boolean NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "todolist"."status" ADD CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."task_attachment" ADD CONSTRAINT "FK_af192cfe21f9fde89a37adb7700" FOREIGN KEY ("taskId") REFERENCES "todolist"."task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."task_attachment" ADD CONSTRAINT "FK_262c324837bd923faac49ff2783" FOREIGN KEY ("attachmentId") REFERENCES "todolist"."attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task_attachment" DROP CONSTRAINT "FK_262c324837bd923faac49ff2783"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task_attachment" DROP CONSTRAINT "FK_af192cfe21f9fde89a37adb7700"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b"`);
        await queryRunner.query(`ALTER TABLE "todolist"."status" DROP CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729"`);
        await queryRunner.query(`DROP TABLE "todolist"."attachment"`);
        await queryRunner.query(`DROP TABLE "todolist"."task_attachment"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" RENAME COLUMN "todolistId" TO "todoListId"`);
        await queryRunner.query(`ALTER TABLE "todolist"."status" RENAME COLUMN "todolistId" TO "todoListId"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD CONSTRAINT "FK_ed2187c496930a6950777fd8f6d" FOREIGN KEY ("todoListId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."status" ADD CONSTRAINT "FK_65c210de03af91ae2c8c520549b" FOREIGN KEY ("todoListId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

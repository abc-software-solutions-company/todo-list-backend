import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexColumnForTask1673234427324 implements MigrationInterface {
    name = 'AddIndexColumnForTask1673234427324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todolist"."notification" ("id" BIGSERIAL NOT NULL, "content" character varying NOT NULL, "link" text, "type" text, "before" text, "after" text, "recipientId" uuid NOT NULL, "senderId" uuid NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" ADD "indexColumn" bigint`);
        await queryRunner.query(`ALTER TABLE "todolist"."notification" ADD CONSTRAINT "FK_ab7cbe7a013ecac5da0a8f88884" FOREIGN KEY ("recipientId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."notification" ADD CONSTRAINT "FK_c0af34102c13c654955a0c5078b" FOREIGN KEY ("senderId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."notification" DROP CONSTRAINT "FK_c0af34102c13c654955a0c5078b"`);
        await queryRunner.query(`ALTER TABLE "todolist"."notification" DROP CONSTRAINT "FK_ab7cbe7a013ecac5da0a8f88884"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task" DROP COLUMN "indexColumn"`);
        await queryRunner.query(`DROP TABLE "todolist"."notification"`);
    }

}

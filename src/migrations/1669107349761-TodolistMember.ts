import { MigrationInterface, QueryRunner } from "typeorm";

export class TodolistMember1669107349761 implements MigrationInterface {
    name = 'TodolistMember1669107349761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todolist"."todolist_user" ("todolistId" character varying NOT NULL, "userId" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_de0eb3f72291e63a79b9d94a26e" PRIMARY KEY ("todolistId", "userId"))`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist_user" ADD CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist_user" ADD CONSTRAINT "FK_6e333d14b7f063e7e7dc7f7fa04" FOREIGN KEY ("userId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."todolist_user" DROP CONSTRAINT "FK_6e333d14b7f063e7e7dc7f7fa04"`);
        await queryRunner.query(`ALTER TABLE "todolist"."todolist_user" DROP CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc"`);
        await queryRunner.query(`DROP TABLE "todolist"."todolist_user"`);
    }

}

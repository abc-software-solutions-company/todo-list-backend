import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIscreateDateDocumentsFeature1681870590636 implements MigrationInterface {
    name = 'AddIscreateDateDocumentsFeature1681870590636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist_stage"."document" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."todolist" DROP CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."task" DROP CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."favorite" DROP CONSTRAINT "FK_d869ad56091727f8e746967bfe0"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."todolist_user" DROP CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."status" DROP CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."document" DROP CONSTRAINT "FK_0f10c2404755fd85c4cfa5f61be"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."todolist" ADD CONSTRAINT "UQ_ad126e5bdbcae6306ea2266a1f2" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."favorite" ADD CONSTRAINT "FK_d869ad56091727f8e746967bfe0" FOREIGN KEY ("todolistId") REFERENCES "todolist_stage"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."status" ADD CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729" FOREIGN KEY ("todolistId") REFERENCES "todolist_stage"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."todolist_user" ADD CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc" FOREIGN KEY ("todolistId") REFERENCES "todolist_stage"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."todolist" ADD CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2" FOREIGN KEY ("id") REFERENCES "todolist_stage"."pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."document" ADD CONSTRAINT "FK_0f10c2404755fd85c4cfa5f61be" FOREIGN KEY ("todolistId") REFERENCES "todolist_stage"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."task" ADD CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b" FOREIGN KEY ("todolistId") REFERENCES "todolist_stage"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist_stage"."task" DROP CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."document" DROP CONSTRAINT "FK_0f10c2404755fd85c4cfa5f61be"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."todolist" DROP CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."todolist_user" DROP CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."status" DROP CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."favorite" DROP CONSTRAINT "FK_d869ad56091727f8e746967bfe0"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."todolist" DROP CONSTRAINT "UQ_ad126e5bdbcae6306ea2266a1f2"`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."document" ADD CONSTRAINT "FK_0f10c2404755fd85c4cfa5f61be" FOREIGN KEY ("todolistId") REFERENCES "todolist_stage"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."status" ADD CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729" FOREIGN KEY ("todolistId") REFERENCES "todolist_stage"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."todolist_user" ADD CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc" FOREIGN KEY ("todolistId") REFERENCES "todolist_stage"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."favorite" ADD CONSTRAINT "FK_d869ad56091727f8e746967bfe0" FOREIGN KEY ("todolistId") REFERENCES "todolist_stage"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."task" ADD CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b" FOREIGN KEY ("todolistId") REFERENCES "todolist_stage"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."todolist" ADD CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2" FOREIGN KEY ("id") REFERENCES "todolist_stage"."pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_stage"."document" DROP COLUMN "createdAt"`);
    }

}

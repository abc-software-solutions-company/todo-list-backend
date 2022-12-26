import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotification1672042247403 implements MigrationInterface {
    name = 'AddNotification1672042247403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist" DROP CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_d869ad56091727f8e746967bfe0"`);
        await queryRunner.query(`ALTER TABLE "todolist_user" DROP CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc"`);
        await queryRunner.query(`ALTER TABLE "status" DROP CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729"`);
        await queryRunner.query(`ALTER TABLE "todolist" ADD CONSTRAINT "UQ_ad126e5bdbcae6306ea2266a1f2" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_d869ad56091727f8e746967bfe0" FOREIGN KEY ("todolistId") REFERENCES "todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "status" ADD CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729" FOREIGN KEY ("todolistId") REFERENCES "todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_user" ADD CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc" FOREIGN KEY ("todolistId") REFERENCES "todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist" ADD CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2" FOREIGN KEY ("id") REFERENCES "pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b" FOREIGN KEY ("todolistId") REFERENCES "todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b"`);
        await queryRunner.query(`ALTER TABLE "todolist" DROP CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2"`);
        await queryRunner.query(`ALTER TABLE "todolist_user" DROP CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc"`);
        await queryRunner.query(`ALTER TABLE "status" DROP CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729"`);
        await queryRunner.query(`ALTER TABLE "favorite" DROP CONSTRAINT "FK_d869ad56091727f8e746967bfe0"`);
        await queryRunner.query(`ALTER TABLE "todolist" DROP CONSTRAINT "UQ_ad126e5bdbcae6306ea2266a1f2"`);
        await queryRunner.query(`ALTER TABLE "status" ADD CONSTRAINT "FK_41fffa8edb50e874f1b2a4fa729" FOREIGN KEY ("todolistId") REFERENCES "todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist_user" ADD CONSTRAINT "FK_42a978f042cbb54bd841adfc3fc" FOREIGN KEY ("todolistId") REFERENCES "todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite" ADD CONSTRAINT "FK_d869ad56091727f8e746967bfe0" FOREIGN KEY ("todolistId") REFERENCES "todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_5b6f20c9bbed2e5497e83f4a03b" FOREIGN KEY ("todolistId") REFERENCES "todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist" ADD CONSTRAINT "FK_ad126e5bdbcae6306ea2266a1f2" FOREIGN KEY ("id") REFERENCES "pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

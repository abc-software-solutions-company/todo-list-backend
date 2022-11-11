import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateComment1668130552955 implements MigrationInterface {
    name = 'UpdateComment1668130552955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."comment" DROP CONSTRAINT "FK_95083dd0d48e33057ed16e1172d"`);
        await queryRunner.query(`ALTER TABLE "todolist"."comment" DROP COLUMN "attachmentId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."comment" ADD "attachmentId" bigint`);
        await queryRunner.query(`ALTER TABLE "todolist"."comment" ADD CONSTRAINT "FK_95083dd0d48e33057ed16e1172d" FOREIGN KEY ("attachmentId") REFERENCES "todolist"."attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

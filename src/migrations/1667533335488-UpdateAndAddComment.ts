import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAndAddComment1667533335488 implements MigrationInterface {
    name = 'UpdateAndAddComment1667533335488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todolist"."comment" ("id" BIGSERIAL NOT NULL, "comment" text NOT NULL, "userId" uuid NOT NULL, "taskId" character varying NOT NULL, "attachmentId" bigint, "isActive" boolean NOT NULL DEFAULT true, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "todolist"."attachment" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL DEFAULT 'Attachment', "link" text NOT NULL, "taskId" character varying NOT NULL, "userId" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "todolist"."comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."comment" ADD CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "todolist"."task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."comment" ADD CONSTRAINT "FK_95083dd0d48e33057ed16e1172d" FOREIGN KEY ("attachmentId") REFERENCES "todolist"."attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."attachment" ADD CONSTRAINT "FK_611282e10752b2ecbd5c8525ab5" FOREIGN KEY ("taskId") REFERENCES "todolist"."task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."attachment" ADD CONSTRAINT "FK_c32d96ba8b2bab65f5432d19a3c" FOREIGN KEY ("userId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."attachment" DROP CONSTRAINT "FK_c32d96ba8b2bab65f5432d19a3c"`);
        await queryRunner.query(`ALTER TABLE "todolist"."attachment" DROP CONSTRAINT "FK_611282e10752b2ecbd5c8525ab5"`);
        await queryRunner.query(`ALTER TABLE "todolist"."comment" DROP CONSTRAINT "FK_95083dd0d48e33057ed16e1172d"`);
        await queryRunner.query(`ALTER TABLE "todolist"."comment" DROP CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95"`);
        await queryRunner.query(`ALTER TABLE "todolist"."comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`DROP TABLE "todolist"."attachment"`);
        await queryRunner.query(`DROP TABLE "todolist"."comment"`);
    }

}

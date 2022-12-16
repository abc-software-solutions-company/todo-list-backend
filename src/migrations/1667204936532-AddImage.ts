import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImage1667204936532 implements MigrationInterface {
    name = 'AddImage1667204936532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todolist"."image" ("id" BIGSERIAL NOT NULL, "link" text NOT NULL, "isActive" boolean NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "todolist"."task_image" ("taskId" character varying NOT NULL, "imageId" bigint NOT NULL, "isActive" boolean NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f8d8d3b7baab65b3b232af5b256" PRIMARY KEY ("taskId", "imageId"))`);
        await queryRunner.query(`ALTER TABLE "todolist"."task_image" ADD CONSTRAINT "FK_add63e68fc8548e1bbb22d8d417" FOREIGN KEY ("taskId") REFERENCES "todolist"."task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."task_image" ADD CONSTRAINT "FK_29e0e0a3d6e9358bba2249ad678" FOREIGN KEY ("imageId") REFERENCES "todolist"."image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."task_image" DROP CONSTRAINT "FK_29e0e0a3d6e9358bba2249ad678"`);
        await queryRunner.query(`ALTER TABLE "todolist"."task_image" DROP CONSTRAINT "FK_add63e68fc8548e1bbb22d8d417"`);
        await queryRunner.query(`DROP TABLE "todolist"."task_image"`);
        await queryRunner.query(`DROP TABLE "todolist"."image"`);
    }

}

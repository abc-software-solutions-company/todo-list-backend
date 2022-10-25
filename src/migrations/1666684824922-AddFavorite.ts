import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavorite1666684824922 implements MigrationInterface {
    name = 'AddFavorite1666684824922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todolist"."favorite" ("userId" uuid NOT NULL, "todolistId" character varying NOT NULL, "isActive" boolean NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c40bb31dcec43d9c2b9220aa88f" PRIMARY KEY ("userId", "todolistId"))`);
        await queryRunner.query(`ALTER TABLE "todolist"."favorite" ADD CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d" FOREIGN KEY ("userId") REFERENCES "todolist"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todolist"."favorite" ADD CONSTRAINT "FK_d869ad56091727f8e746967bfe0" FOREIGN KEY ("todolistId") REFERENCES "todolist"."todolist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todolist"."favorite" DROP CONSTRAINT "FK_d869ad56091727f8e746967bfe0"`);
        await queryRunner.query(`ALTER TABLE "todolist"."favorite" DROP CONSTRAINT "FK_83b775fdebbe24c29b2b5831f2d"`);
        await queryRunner.query(`DROP TABLE "todolist"."favorite"`);
    }

}

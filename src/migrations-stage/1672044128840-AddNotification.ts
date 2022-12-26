import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotification1672044128840 implements MigrationInterface {
    name = 'AddNotification1672044128840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" BIGSERIAL NOT NULL, "content" character varying NOT NULL, "link" text, "type" text, "recipientID" uuid NOT NULL, "senderID" uuid NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_31e7e90b3e52e9c24f2b5fc85ab" FOREIGN KEY ("recipientID") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_3b1855ee9c8f9c171418ca17c38" FOREIGN KEY ("senderID") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_3b1855ee9c8f9c171418ca17c38"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_31e7e90b3e52e9c24f2b5fc85ab"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}

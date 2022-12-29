import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotification1672299526073 implements MigrationInterface {
    name = 'AddNotification1672299526073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_31e7e90b3e52e9c24f2b5fc85ab"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_3b1855ee9c8f9c171418ca17c38"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "recipientID"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "senderID"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "recipientId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "recipientId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "senderId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "senderId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_ab7cbe7a013ecac5da0a8f88884" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_c0af34102c13c654955a0c5078b" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_c0af34102c13c654955a0c5078b"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_ab7cbe7a013ecac5da0a8f88884"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "senderId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "senderId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "recipientId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "recipientId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "content" text`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "senderID" uuid`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "recipientID" uuid`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_3b1855ee9c8f9c171418ca17c38" FOREIGN KEY ("senderID") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_31e7e90b3e52e9c24f2b5fc85ab" FOREIGN KEY ("recipientID") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

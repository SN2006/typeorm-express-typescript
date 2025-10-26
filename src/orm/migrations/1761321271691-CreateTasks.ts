import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasks1761321271691 implements MigrationInterface {
  name = 'CreateTasks1761321271691';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "task_types" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "user_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_232576669c4df1f0a15e1300ce2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "states" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "user_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_09ab30ca0975c02656483265f4f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" SERIAL NOT NULL,
                "title" character varying(200) NOT NULL,
                "description" text,
                "priority" character varying(20) NOT NULL DEFAULT 'MEDIUM',
                "user_id" integer NOT NULL,
                "task_type_id" integer,
                "state_id" integer,
                "due_date" TIMESTAMP,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "task_types"
            ADD CONSTRAINT "FK_e2d9adca0dd25a04420e39164da" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "states"
            ADD CONSTRAINT "FK_20c6866f0562f23f0ab03016df6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks"
            ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks"
            ADD CONSTRAINT "FK_ea76a982cfc3dd4bff34daaf036" FOREIGN KEY ("task_type_id") REFERENCES "task_types"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks"
            ADD CONSTRAINT "FK_f717afec5dc59f63d20689732b4" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tasks" DROP CONSTRAINT "FK_f717afec5dc59f63d20689732b4"
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks" DROP CONSTRAINT "FK_ea76a982cfc3dd4bff34daaf036"
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"
        `);
    await queryRunner.query(`
            ALTER TABLE "states" DROP CONSTRAINT "FK_20c6866f0562f23f0ab03016df6"
        `);
    await queryRunner.query(`
            ALTER TABLE "task_types" DROP CONSTRAINT "FK_e2d9adca0dd25a04420e39164da"
        `);
    await queryRunner.query(`
            DROP TABLE "tasks"
        `);
    await queryRunner.query(`
            DROP TABLE "states"
        `);
    await queryRunner.query(`
            DROP TABLE "task_types"
        `);
  }
}

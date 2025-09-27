import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1758958987137 implements MigrationInterface {
    name = 'InitSchema1758958987137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`salt\` varchar(255) NOT NULL, \`name\` varchar(100) NOT NULL, \`phone_number\` varchar(100) NOT NULL, \`account_status\` enum ('Offline', 'Online') NOT NULL DEFAULT 'Offline', \`type\` enum ('Admin', 'User') NOT NULL, \`profile_image\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(200) NOT NULL, \`description\` text NULL, \`status\` enum ('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO', \`priority\` enum ('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM', \`dueDate\` datetime NULL, \`assigneeId\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, INDEX \`IDX_067be4bd67747aa64451933929\` (\`title\`), INDEX \`IDX_6086c8dafbae729a930c04d865\` (\`status\`), INDEX \`IDX_bd213ab7fa55f02309c5f23bbc\` (\`priority\`), INDEX \`IDX_c300d154a85801889174e92a3d\` (\`dueDate\`), INDEX \`IDX_9a16d2c86252529f622fa53f1e\` (\`assigneeId\`), INDEX \`IDX_10f8a3df60c9e7771cefba6c35\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_9a16d2c86252529f622fa53f1e3\` FOREIGN KEY (\`assigneeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_9a16d2c86252529f622fa53f1e3\``);
        await queryRunner.query(`DROP INDEX \`IDX_10f8a3df60c9e7771cefba6c35\` ON \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_9a16d2c86252529f622fa53f1e\` ON \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_c300d154a85801889174e92a3d\` ON \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_bd213ab7fa55f02309c5f23bbc\` ON \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_6086c8dafbae729a930c04d865\` ON \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_067be4bd67747aa64451933929\` ON \`tasks\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectConversationMessageRelations1736175543446 implements MigrationInterface {
    name = 'AddProjectConversationMessageRelations1736175543446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message\` ADD \`conversationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_7cf4a4df1f2627f72bf6231635f\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_7c4b0d3b77eaf26f8b4da879e63\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_c308b1cd542522bb66430fa860a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_dd389587c03c80b36ac7f32c319\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_dd389587c03c80b36ac7f32c319\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_c308b1cd542522bb66430fa860a\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_7c4b0d3b77eaf26f8b4da879e63\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_7cf4a4df1f2627f72bf6231635f\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`role\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`role\` varchar(45) NULL`);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`conversationId\``);
    }

}

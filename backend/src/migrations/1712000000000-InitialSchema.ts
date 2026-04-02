import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitialSchema1712000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'githubId',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'avatarUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'walletAddress',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'chainTag',
            type: 'varchar',
          },
          {
            name: 'upvotes',
            type: 'int',
            default: 0,
          },
          {
            name: 'authorId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'tips',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'amount',
            type: 'decimal',
          },
          {
            name: 'senderId',
            type: 'uuid',
          },
          {
            name: 'receiverId',
            type: 'uuid',
          },
          {
            name: 'postId',
            type: 'uuid',
          },
          {
            name: 'txHash',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'tips',
      new TableForeignKey({
        columnNames: ['senderId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'tips',
      new TableForeignKey({
        columnNames: ['receiverId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'tips',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedTableName: 'posts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tipsTable = await queryRunner.getTable('tips');
    if (tipsTable) {
      for (const fk of tipsTable.foreignKeys) {
        await queryRunner.dropForeignKey('tips', fk);
      }
    }

    const postsTable = await queryRunner.getTable('posts');
    if (postsTable) {
      for (const fk of postsTable.foreignKeys) {
        await queryRunner.dropForeignKey('posts', fk);
      }
    }

    await queryRunner.dropTable('tips', true);
    await queryRunner.dropTable('posts', true);
    await queryRunner.dropTable('users', true);
  }
}

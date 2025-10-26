import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { TaskType } from '../entities/taskTypes/TaskType';
import { User } from '../entities/users/User';

export class SeedTaskTypes1590519635403 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = getRepository(User);
    const taskTypeRepository = getRepository(TaskType);

    const adminUser = await userRepository.findOne({ where: { username: 'Heisenberg' } });

    if (!adminUser) {
      console.log('Admin user not found. Please run user seeds first.');
      return;
    }

    const taskTypes = [
      { name: 'Feature', userId: adminUser.id },
      { name: 'Bug', userId: adminUser.id },
      { name: 'Improvement', userId: adminUser.id },
      { name: 'Documentation', userId: adminUser.id },
      { name: 'Research', userId: adminUser.id },
      { name: 'Meeting', userId: adminUser.id },
    ];

    for (const taskTypeData of taskTypes) {
      const taskType = new TaskType();
      taskType.name = taskTypeData.name;
      taskType.userId = taskTypeData.userId;
      await taskTypeRepository.save(taskType);
    }

    console.log('Task types seeded successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}

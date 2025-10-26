import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { State } from '../entities/states/State';
import { Task } from '../entities/tasks/Task';
import { TaskPriority } from '../entities/tasks/types';
import { TaskType } from '../entities/taskTypes/TaskType';
import { User } from '../entities/users/User';

export class SeedTasks1590519635404 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = getRepository(User);
    const taskRepository = getRepository(Task);
    const stateRepository = getRepository(State);
    const taskTypeRepository = getRepository(TaskType);

    const adminUser = await userRepository.findOne({ where: { username: 'Heisenberg' } });

    if (!adminUser) {
      console.log('Users not found. Please run user seeds first.');
      return;
    }

    const todoState = await stateRepository.findOne({ where: { name: 'To Do' } });
    const inProgressState = await stateRepository.findOne({ where: { name: 'In Progress' } });
    const doneState = await stateRepository.findOne({ where: { name: 'Done' } });

    const featureType = await taskTypeRepository.findOne({ where: { name: 'Feature' } });
    const bugType = await taskTypeRepository.findOne({ where: { name: 'Bug' } });
    const researchType = await taskTypeRepository.findOne({ where: { name: 'Research' } });
    const documentationType = await taskTypeRepository.findOne({ where: { name: 'Documentation' } });

    const tasks = [
      {
        title: 'Setup production environment',
        description: 'Configure Docker and deploy the application to production server',
        priority: 'HIGH' as TaskPriority,
        userId: adminUser.id,
        stateId: inProgressState?.id,
        taskTypeId: featureType?.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // через 7 дней
      },
      {
        title: 'Fix authentication bug',
        description: 'Users are experiencing issues with JWT token expiration',
        priority: 'HIGH' as TaskPriority,
        userId: adminUser.id,
        stateId: todoState?.id,
        taskTypeId: bugType?.id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // через 2 дня
      },
      {
        title: 'Research new database optimization techniques',
        description: 'Investigate query optimization strategies for TypeORM',
        priority: 'MEDIUM' as TaskPriority,
        userId: adminUser.id,
        stateId: todoState?.id,
        taskTypeId: researchType?.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // через 14 дней
      },
      {
        title: 'Implement user profile page',
        description: 'Create a page where users can edit their profile information',
        priority: 'MEDIUM' as TaskPriority,
        userId: adminUser.id,
        stateId: inProgressState?.id,
        taskTypeId: featureType?.id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // через 5 дней
      },
      {
        title: 'Write API documentation',
        description: 'Document all API endpoints with examples',
        priority: 'LOW' as TaskPriority,
        userId: adminUser.id,
        stateId: doneState?.id,
        taskTypeId: documentationType?.id,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // был вчера
      },
    ];

    for (const taskData of tasks) {
      const task = new Task();
      task.title = taskData.title;
      task.description = taskData.description;
      task.priority = taskData.priority;
      task.userId = taskData.userId;
      task.stateId = taskData.stateId || null;
      task.taskTypeId = taskData.taskTypeId || null;
      task.dueDate = taskData.dueDate;
      await taskRepository.save(task);
    }

    console.log('Tasks seeded successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}

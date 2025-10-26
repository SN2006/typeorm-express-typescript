import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { State } from '../entities/states/State';
import { User } from '../entities/users/User';

export class SeedStates1590519635402 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepository = getRepository(User);
    const stateRepository = getRepository(State);

    const adminUser = await userRepository.findOne({ where: { username: 'Heisenberg' } });

    if (!adminUser) {
      console.log('Admin user not found. Please run user seeds first.');
      return;
    }

    const states = [
      { name: 'To Do', userId: adminUser.id },
      { name: 'In Progress', userId: adminUser.id },
      { name: 'In Review', userId: adminUser.id },
      { name: 'Done', userId: adminUser.id },
      { name: 'Cancelled', userId: adminUser.id },
    ];

    for (const stateData of states) {
      const state = new State();
      state.name = stateData.name;
      state.userId = stateData.userId;
      await stateRepository.save(state);
    }

    console.log('States seeded successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}

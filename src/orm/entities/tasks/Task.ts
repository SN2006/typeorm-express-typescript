import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

import { State } from '../states/State';
import { TaskType } from '../taskTypes/TaskType';
import { User } from '../users/User';

import { TaskPriority } from './types';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 200,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    default: 'MEDIUM' as TaskPriority,
    length: 20,
  })
  priority: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => TaskType, { onDelete: 'SET NULL', nullable: true })
  taskType: TaskType;

  @Column({ nullable: true })
  taskTypeId: number;

  @ManyToOne(() => State, { onDelete: 'SET NULL', nullable: true })
  state: State;

  @Column({ nullable: true })
  stateId: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dueDate: Date;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}

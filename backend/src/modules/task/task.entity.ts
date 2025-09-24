
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn,
    UpdateDateColumn, DeleteDateColumn, Index
  } from 'typeorm';
import { TaskPriority, TaskStatus } from './types';
import { User } from '../user';
  
  @Entity({ name: 'tasks' })
  export class Task {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 200 })
    @Index()
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
    @Index()
    status: TaskStatus;
  
    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    @Index()
    priority: TaskPriority;
  
    @Column({ type: 'datetime', nullable: true })
    @Index()
    dueDate?: Date;
  
    @ManyToOne(() => User, { nullable: true, eager: false })
    @Index()
    assignee?: User;
  
    @Column({ nullable: true })
    assigneeId?: number;
  
    @CreateDateColumn()
    @Index()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
  }
  
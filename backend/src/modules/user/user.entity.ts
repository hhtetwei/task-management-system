import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountStatus, UserType } from './types';
import { Image } from 'src/types';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'salt' })
  salt: string;

  @Column({ length: 100, name: 'name' })
  name: string;

  @Column({ length: 100, name: 'phone_number' })
  phoneNumber: string;

  @Column({
    name: 'account_status',
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.OFFLINE,
  })
  accountStatus: AccountStatus;

  @Column({
    name: 'type',
    type: 'enum',
    enum: UserType,
  })
  type: UserType;

  @Column({ name: 'profile_image', type: 'json', nullable: true })
  profileImage: Image;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}

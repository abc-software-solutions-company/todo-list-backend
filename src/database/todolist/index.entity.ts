import { Task } from 'src/database/task/index.entity';
import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Favorite } from '../favorite/index.entity';
import { Pool } from '../pool/index.entity';
import { Status } from '../status/index.entity';
import { TodolistUser } from '../todolist-user/index.entity';
import { User } from '../user/index.entity';

@Entity()
export class Todolist {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  taskSymbol: string;

  @Column()
  userId: string;

  @Column()
  visibility: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToOne(() => Pool, (pool) => pool.id)
  @JoinColumn({ name: 'id' })
  pool: Pool;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Task, (task) => task.todolist)
  tasks: Task[];

  @OneToMany(() => Status, (status) => status.todolist)
  status: Status[];

  @OneToMany(() => Favorite, (favorite) => favorite.todolist)
  favorites: Favorite[];

  @OneToMany(() => TodolistUser, (member) => member.todolist)
  members: TodolistUser[];
}

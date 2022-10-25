import { Task } from 'src/database/task/task.entity';
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
import { Favorite } from '../favorite/favorite.entity';
import { Pool } from '../pool/pool.entity';
import { Status } from '../status/status.entity';
import { User } from '../user/user.entity';

@Entity()
export class Todolist {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @Column()
  visibility: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @OneToOne(() => Pool, (pool) => pool.id)
  @JoinColumn({ name: 'id' })
  pool: Pool;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Task, (task) => task.todoList)
  tasks: Task[];

  @OneToMany(() => Status, (status) => status.todoList)
  status: Status[];

  @OneToMany(() => Favorite, (favorite) => favorite.todolist)
  favorites: Favorite[];
}

import { Entity, Column, OneToMany, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { Task } from 'src/database/task/task.entity';
import { Todolist } from 'src/database/todolist/todolist.entity';
import { Favorite } from '../favorite/favorite.entity';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @OneToMany(() => Todolist, (list) => list.user)
  lists: Todolist[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}

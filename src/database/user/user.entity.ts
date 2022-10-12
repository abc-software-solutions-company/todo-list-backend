import { Entity, Column, OneToMany, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { Task } from 'src/database/task/task.entity';
import { Todolist } from 'src/database/todolist/todolist.entity';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => Todolist, (list) => list.userId)
  lists: Todolist[];

  @OneToMany(() => Task, (task) => task.userId)
  tasks: Task[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}

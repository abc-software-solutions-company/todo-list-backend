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

  @OneToMany(() => Todolist, (list) => list.user)
  lists: Todolist[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;
}

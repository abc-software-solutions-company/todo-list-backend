import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  PrimaryColumn,
} from "typeorm";

import { Task } from "src/task/entities/task.entity";
import { Todolist } from 'src/todolist/entities/todolist.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({nullable:true})
  email: string;

  @Column()
  userName: string;

  @OneToMany(() => Todolist, (list) => list.userId)
  lists: Todolist[];

  @OneToMany(() => Task, (task) => task.userId)
  tasks: Task[];


  @CreateDateColumn()
  createdDate: Date;
}

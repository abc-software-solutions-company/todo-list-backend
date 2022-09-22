import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
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

  @Column()
  userName: string;

  @OneToMany(() => Todolist, (list) => list.userId)
  lists: Todolist[];

  @OneToMany(() => Task, (task) => task.userId)
  tasks: Task[];


  @CreateDateColumn()
  createdDate: Date;

  @AfterInsert()
  logInsert() {
    console.log("😀Inserted User with id", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("😀Updated User with id", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("😀Removed User with id", this.id);
  }
}

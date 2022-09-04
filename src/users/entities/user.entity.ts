import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";

import { Task } from "src/task/entities/task.entity";
import { IsUUID } from 'class-validator';
import { Todolist } from 'src/todolist/entities/todolist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column()
  userName: string;

  @OneToMany(() => Todolist, (list) => list.userId)
  lists: Todolist[];

  @CreateDateColumn()
  createdDate: Date;

  @AfterInsert()
  logInsert() {
    console.log("Inserted User with id", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("Updated User with id", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("Removed User with id", this.id);
  }
}

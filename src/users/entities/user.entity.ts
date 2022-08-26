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

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @IsUUID()
  id: string;

  @Column()
  userName: string;

  @OneToMany(() => Task, (task) => task.userId)
  tasks: Task[];

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

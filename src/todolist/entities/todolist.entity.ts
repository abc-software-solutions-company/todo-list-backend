import { type } from "os";
import { Task } from "src/task/entities/task.entity";
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Todolist {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column()
  list_name: string;

  @OneToMany(() => Task, (task) => task.todolistId)
  tasks: Task[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @AfterInsert()
  logInsert() {
    console.log("Inserted TodoListwith id", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("Updated TodoListwith id", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("Removed TodoListwith id", this.id);
  }
}

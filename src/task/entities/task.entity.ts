import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Todolist } from "src/todolist/entities/todolist.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  task_name: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column()
  userId: string;

  @Column()
  todolistId: number;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  user: User;

  @ManyToOne(() => Todolist, (todolist) => todolist.id, { cascade: true })
  todolist: Todolist;
}

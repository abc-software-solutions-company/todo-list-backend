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
  taskName: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({default: false})
  isDone: boolean;

  @Column()
  userId: string;

  @Column()
  todolistId: number;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, onDelete:'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @ManyToOne(() => Todolist, (todolist) => todolist.id, { cascade: true, onDelete:'CASCADE', onUpdate: 'CASCADE' })
  todolist: Todolist;
}

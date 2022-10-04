import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  PrimaryColumn,
} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Todolist } from "src/todolist/entities/todolist.entity";

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({default: false})
  isDone: boolean;

  @Column({default:true})
  isActive: boolean

  @Column({default: 0})
  status: number

  @Column()
  todoListId: string;

  @Column()
  userId: string;

  @Column({default:0})
  index: number;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, onDelete:'CASCADE', onUpdate: 'CASCADE' })
  user: User;
  @ManyToOne(() => Todolist, (todoList) => todoList.id, { cascade: true, onDelete:'CASCADE', onUpdate: 'CASCADE' })
  todoList: Todolist;

  @AfterInsert()
  logInsert() {
    console.log("😀Inserted Task with id", this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log("😀Updated Task with id", this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log("😀Removed Task with id", this.id);
  }
}

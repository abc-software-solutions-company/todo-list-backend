import { type } from "os";
import { Task } from "src/task/entities/task.entity";
import { User } from 'src/users/entities/user.entity';
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
  ManyToOne,
} from "typeorm";

@Entity()
export class Todolist {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.todolistId)
  tasks: Task[];

  @Column({default:true})
  isActive: boolean

  @Column()
  userId: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, onDelete:'CASCADE', onUpdate: 'CASCADE' })
  user: User;

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

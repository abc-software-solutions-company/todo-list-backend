import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Task } from '../task/task.entity';
import { Todolist } from '../todolist/todolist.entity';

@Entity()
export class Status {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column({ type: 'bigint' })
  index: number;

  @Column()
  todoListId: string;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ManyToOne(() => Todolist, (todolist) => todolist.id)
  @JoinColumn({ name: 'todoListId' })
  todoList: Todolist;

  @OneToMany(() => Task, (task) => task)
  tasks: Task[];
}

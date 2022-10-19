import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Todolist } from '../todolist/todolist.entity';
import { User } from '../user/user.entity';

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  isDone: boolean;

  @Column()
  todoListId: string;

  @Column()
  userId: string;

  @Column({ type: 'bigint' })
  index: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Todolist, (todoList) => todoList.id)
  @JoinColumn({ name: 'todoListId' })
  todoList: Todolist;
}

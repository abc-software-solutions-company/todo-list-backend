import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
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

  @Column({ default: 0 , type: 'bigint'})
  index: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @ManyToOne(() => Todolist, (todoList) => todoList.id, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  todoList: Todolist;
}

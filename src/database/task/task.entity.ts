import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Status } from '../status/status.entity';
import { TaskImage } from '../taskImage/taskImage.entity';
import { Todolist } from '../todolist/todolist.entity';
import { User } from '../user/user.entity';

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isDone: boolean;

  @Column()
  todoListId: string;

  @Column({ nullable: true })
  statusId: number;

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

  @ManyToOne(() => Status, (status) => status.id)
  @JoinColumn({ name: 'statusId' })
  status: Status;

  @OneToMany(() => TaskImage, (taskImage) => taskImage.task)
  taskImages: TaskImage[];
}

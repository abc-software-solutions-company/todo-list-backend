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
import { Status } from '../status/index.entity';
import { TaskAttachment } from '../task-attachment/index.entity';
import { Todolist } from '../todolist/index.entity';
import { User } from '../user/index.entity';

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
  todolistId: string;

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

  @ManyToOne(() => Todolist, (todolist) => todolist.id)
  @JoinColumn({ name: 'todolistId' })
  todolist: Todolist;

  @ManyToOne(() => Status, (status) => status.id)
  @JoinColumn({ name: 'statusId' })
  status: Status;

  @OneToMany(() => TaskAttachment, (taskAttachment) => taskAttachment.task)
  taskAttachments: TaskAttachment[];
}

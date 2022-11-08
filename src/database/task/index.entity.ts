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
import { Attachment } from '../attachment/index.entity';
import { Comment } from '../comment/index.entity';
import { Status } from '../status/index.entity';
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

  @Column({ default: 'Medium' })
  priority: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
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

  @OneToMany(() => Attachment, (attachment) => attachment.task)
  attachments: Attachment[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment;
}

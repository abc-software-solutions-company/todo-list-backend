import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Attachment } from '../attachment/index.entity';
import { Comment } from '../comment/index.entity';
import { Status } from '../status/index.entity';
import { TaskUser } from '../task-user/index.entity';
import { Todolist } from '../todolist/index.entity';
import { User } from '../user/index.entity';
import { Document } from '../document/index.entity';
import { TaskTypeEnum, priorities } from 'src/utils/constants';

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  order: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  storyPoint: string;

  @Column({ default: false })
  isDone: boolean;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column()
  todolistId: string;

  @Column({ nullable: true })
  statusId: number;

  @Column()
  userId: string;

  @Column({ type: 'bigint' })
  index: number;

  @Column({ type: 'bigint', nullable: true })
  indexColumn: number;

  @Column({ default: priorities.medium })
  priority: string;

  @Column({
    type: 'enum',
    enum: TaskTypeEnum,
    default: TaskTypeEnum.TASK,
  })
  type: TaskTypeEnum;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeature: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToMany(() => Task)
  @JoinTable({ name: 'related_tasks' })
  relatedTasks: Task[];

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
  comments: Comment[];

  @OneToMany(() => TaskUser, (TaskUser) => TaskUser.task)
  assignees: TaskUser[];

  @OneToMany(() => Document, (document) => document.todolist)
  documents: Document[];
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../task/index.entity';
import { User } from '../user/index.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column({ default: 'attachment' })
  name: string;

  @Column({ type: 'text' })
  link: string;

  @Column()
  taskId: string;

  @Column()
  userId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', default: 'image' })
  type: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}

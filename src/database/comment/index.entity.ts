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
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column({ type: 'text' })
  comment: string;

  @Column()
  userId: string;

  @Column()
  taskId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn({ name: 'taskId' })
  task: Task;
}

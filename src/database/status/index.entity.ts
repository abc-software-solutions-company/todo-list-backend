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
import { Task } from '../task/index.entity';
import { Todolist } from '../todolist/index.entity';

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

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column()
  todolistId: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => Todolist, (todolist) => todolist.id)
  @JoinColumn({ name: 'todolistId' })
  todolist: Todolist;

  @OneToMany(() => Task, (task) => task.status)
  tasks: Task[];
}

import { Task } from 'src/database/task/task.entity';
import { Entity, Column, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Pool } from '../pool/pool.entity';
import { User } from '../user/user.entity';

@Entity()
export class Todolist {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Task, (task) => task.todoList)
  tasks: Task[];

  @OneToOne(() => Pool, (pool) => pool.id)
  @JoinColumn({ name: 'id' })
  pool: Pool;
}

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Todolist } from '../todolist/todolist.entity';
import { User } from '../user/user.entity';

@Entity()
export class Favorite {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  todolistId: string;

  @Column({ type: 'boolean' })
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
}

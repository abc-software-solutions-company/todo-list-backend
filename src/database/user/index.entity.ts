import { Entity, Column, OneToMany, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { Task } from 'src/database/task/index.entity';
import { Todolist } from 'src/database/todolist/index.entity';
import { Favorite } from '../favorite/index.entity';
import { Comment } from '../comment/index.entity';
import { Attachment } from '../attachment/index.entity';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => Todolist, (list) => list.user)
  lists: Todolist[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Attachment, (attachment) => attachment.user)
  attachments: Attachment[];
}

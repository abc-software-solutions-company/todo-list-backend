import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Todolist } from '../todolist/index.entity';

@Entity()
export class Document {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true, default: null })
  favorite: number | null;

  @Column({ nullable: true, default: null })
  parentId: string | null;

  @Column()
  todolistId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Todolist, (todolist) => todolist.id)
  @JoinColumn({ name: 'todolistId' })
  todolist: Todolist;

  @ManyToOne(() => Document, (document) => document.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Document;

  @OneToMany(() => Document, (document) => document.parent)
  children: Document[];
}

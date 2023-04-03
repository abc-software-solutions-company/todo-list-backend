import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Todolist } from '../todolist/index.entity';

@Entity()
export class Document {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ default: false })
  favorite: boolean;

  @Column({ nullable: true })
  parentId: string;

  @Column()
  todolistId: string;

  @ManyToOne(() => Todolist, (todolist) => todolist.id)
  @JoinColumn({ name: 'todolistId' })
  todolist: Todolist;

  @ManyToOne(() => Document, (document) => document.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Document;

  @OneToMany(() => Document, (document) => document.parent)
  children: Document[];
}

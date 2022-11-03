import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TaskAttachment } from '../task-attachment/index.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column({ default: 'Attachment' })
  name: string;

  @Column({ type: 'text' })
  link: string;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => TaskAttachment, (taskAttachment) => taskAttachment.attachment)
  taskAttachments: TaskAttachment[];
}

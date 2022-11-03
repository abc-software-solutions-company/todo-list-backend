import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Attachment } from '../attachment/index.entity';
import { Task } from '../task/index.entity';

@Entity({ name: 'task_attachment' })
export class TaskAttachment {
  @PrimaryColumn()
  taskId: string;

  @PrimaryColumn()
  attachmentId: number;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @ManyToOne(() => Attachment, (attachment) => attachment.id)
  @JoinColumn({ name: 'attachmentId' })
  attachment: Attachment;
}

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Image } from '../image/image.entity';
import { Task } from '../task/task.entity';

@Entity({ name: 'task_image' })
export class TaskImage {
  @PrimaryColumn()
  taskId: string;

  @PrimaryColumn()
  imageId: number;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @ManyToOne(() => Image, (image) => image.id)
  @JoinColumn({ name: 'imageId' })
  image: Image;
}

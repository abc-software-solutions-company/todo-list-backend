import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TaskImage } from '../taskImage/taskImage.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column({ default: 'Image' })
  name: string;

  @Column({ type: 'text' })
  link: string;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;

  @OneToMany(() => TaskImage, (taskImage) => taskImage.image)
  taskImages: TaskImage[];
}

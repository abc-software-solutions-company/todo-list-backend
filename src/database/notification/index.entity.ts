import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/index.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column()
  content: string;

  @Column({ type: 'text', nullable: true })
  link: string;

  @Column({ type: 'text', nullable: true })
  type: string;

  @Column({ type: 'text', nullable: true })
  before: string;

  @Column({ type: 'text', nullable: true })
  after: string;

  @Column()
  recipientId: string;

  @Column()
  senderId: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'senderId' })
  sender: User;
}

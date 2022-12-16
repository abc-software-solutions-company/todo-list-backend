import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Pool {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}

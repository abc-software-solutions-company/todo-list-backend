import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Pool {
  @PrimaryColumn({ type: 'varchar', length: 5 })
  id: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @CreateDateColumn({ select: false })
  createdDate: Date;

  @UpdateDateColumn({ select: false })
  updatedDate: Date;
}

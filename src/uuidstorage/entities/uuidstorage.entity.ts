import { Todolist } from 'src/todolist/entities/todolist.entity';
import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Uuidstorage {
  @PrimaryColumn()
  id: string

  @Column({default:false})
  flag: boolean
}

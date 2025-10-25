import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Instruction {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  name: string;

  @Column({
    type: 'text',
  })
  content: string;

}
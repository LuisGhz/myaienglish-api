import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'varchar',
    length: 255,
  })
  token: string;

  @Column({
    type: 'timestamp',
  })
  expiresDate: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isRevoked: boolean;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  userAgent: string | null;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ip: string | null;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}

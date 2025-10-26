import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FavTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'text',
  })
  originalText: string;
  @Column({
    type: 'text',
  })
  translatedText: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity'; // Importa la entidad User si está en otro archivo

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prompt: string;

  @Column({ nullable: true })
  response: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relación con el usuario
  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  user: User;
}

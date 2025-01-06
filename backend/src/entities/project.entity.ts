import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity'; // Importa la entidad User
import { Conversation } from './conversation.entity'; // Importa la entidad Conversation

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relación con el usuario (dueño del proyecto)
  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  // Relación con las conversaciones del proyecto
  @OneToMany(() => Conversation, (conversation) => conversation.project)
  conversations: Conversation[];
}

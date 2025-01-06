import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity'; // Importa la entidad User
import { Project } from './project.entity'; // Importa la entidad Project
import { Message } from './message.entity'; // Importa la entidad Message

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  // Relación con el usuario
  @ManyToOne(() => User, (user) => user.conversations, { onDelete: 'CASCADE' })
  user: User;

  // Relación con el proyecto
  @ManyToOne(() => Project, (project) => project.conversations, {
    onDelete: 'CASCADE',
  })
  project: Project;

  // Relación con los mensajes
  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}

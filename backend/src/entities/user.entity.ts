import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from './message.entity'; // Importa la entidad Message
import { Project } from './project.entity'; // Importa la entidad Project
import { Conversation } from './conversation.entity'; // Importa la entidad Conversation

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  // Relación con los proyectos
  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  // Relación con los mensajes
  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  // Relación con las conversaciones
  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations: Conversation[]; // Aquí agregamos la relación con las conversaciones
}

import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'C0mpl3x!Pwd#2023',
  database: process.env.DB_NAME || 'sandbox',
  synchronize: false, // No sincronizar automáticamente en producción
  logging: true, // Activa los logs de TypeORM
  entities: [User, Project, Conversation, Message], // Asegúrate de agregar todas las entidades
  migrations: ['src/migrations/*.ts'], // Ajusta la ruta a tus migraciones
  subscribers: [],
});

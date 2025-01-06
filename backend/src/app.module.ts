import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Cargar variables de entorno
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sandbox',
      autoLoadEntities: true, // Carga automáticamente todas las entidades registradas
      synchronize: true, // Sincroniza las entidades con la base de datos (solo en desarrollo)
      logging: true, // Activa los logs de TypeORM para depuración
    }),
    OpenaiModule, // Importa el módulo de OpenAI
  ],
})
export class AppModule {}

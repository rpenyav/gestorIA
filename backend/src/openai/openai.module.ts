import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenaiService } from './openai.service';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity'; // Agregar importación de Project
import { Conversation } from '../entities/conversation.entity'; // Agregar importación de Conversation
import {
  ConversationController,
  MessageController,
  ProjectController,
} from './openai.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Project, Conversation]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Proporciona la clave secreta desde las variables de entorno
      signOptions: { expiresIn: '6h' }, // El token expirará en 6 horas
    }),
    UserModule,
  ],
  providers: [OpenaiService],
  controllers: [ProjectController, ConversationController, MessageController],
})
export class OpenaiModule {}

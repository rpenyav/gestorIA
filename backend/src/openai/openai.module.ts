import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User]), // Registra las entidades aquí
  ],
  providers: [OpenaiService],
  controllers: [OpenaiController],
})
export class OpenaiModule {}

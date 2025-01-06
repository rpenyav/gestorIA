import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Query,
  Sse,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Project } from '../entities/project.entity';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity'; // Importa la entidad Message
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { StreamRequestDto } from './dto/stream-request.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly openaiService: OpenaiService) {}

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Post()
  async createProject(
    @Body() body: { userId: number; name: string; description?: string },
  ): Promise<Project> {
    return this.openaiService.createProject(
      body.userId,
      body.name,
      body.description,
    );
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Get(':userId')
  async getProjectsByUser(@Param('userId') userId: number): Promise<Project[]> {
    return this.openaiService.getProjectsByUser(userId);
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Get('project/:projectId')
  async getProjectById(
    @Param('projectId') projectId: number,
  ): Promise<Project> {
    return this.openaiService.getProjectById(projectId);
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Put('project/:projectId')
  async updateProject(
    @Param('projectId') projectId: number,
    @Body() body: { name: string; description?: string },
  ): Promise<Project> {
    return this.openaiService.updateProject(
      projectId,
      body.name,
      body.description,
    );
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Delete('project/:projectId')
  async deleteProject(@Param('projectId') projectId: number): Promise<void> {
    return this.openaiService.deleteProject(projectId);
  }
}

@Controller('conversations')
export class ConversationController {
  constructor(private readonly openaiService: OpenaiService) {}

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Post()
  async createConversation(
    @Body()
    body: {
      userId: number;
      projectId: number;
      title: string;
      description?: string;
    },
  ): Promise<Conversation> {
    return this.openaiService.createConversation(
      body.userId,
      body.projectId,
      body.title,
      body.description,
    );
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Get('project/:projectId')
  async getConversationsByProject(
    @Param('projectId') projectId: number,
  ): Promise<Conversation[]> {
    return this.openaiService.getConversationsByProject(projectId);
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Get(':conversationId')
  async getConversationById(
    @Param('conversationId') conversationId: number,
  ): Promise<Conversation> {
    return this.openaiService.getConversationById(conversationId);
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Put(':conversationId')
  async updateConversation(
    @Param('conversationId') conversationId: number,
    @Body() body: { title: string; description?: string },
  ): Promise<Conversation> {
    return this.openaiService.updateConversation(
      conversationId,
      body.title,
      body.description,
    );
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Delete(':conversationId')
  async deleteConversation(
    @Param('conversationId') conversationId: number,
  ): Promise<void> {
    return this.openaiService.deleteConversation(conversationId);
  }
}

@Controller('messages')
export class MessageController {
  constructor(private readonly openaiService: OpenaiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createMessage(
    @Body()
    body: {
      prompt: string;
      userId: number;
      projectId: number;
      conversationId: number;
    },
  ): Promise<Message> {
    // Crea el mensaje utilizando el servicio
    const message = await this.openaiService.createNewQuestion(
      body.prompt,
      body.userId,
      body.projectId,
      body.conversationId,
    );

    // Devuelve el mensaje creado
    return message;
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Get('conversation/:conversationId')
  async getMessagesByConversation(
    @Param('conversationId') conversationId: number,
  ): Promise<Message[]> {
    return this.openaiService.getMessagesByConversation(conversationId);
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Get(':messageId')
  async getMessageById(
    @Param('messageId') messageId: number,
  ): Promise<Message> {
    if (isNaN(messageId)) {
      throw new BadRequestException(`Invalid message ID: ${messageId}`);
    }

    return this.openaiService.getMessageById(messageId);
  }
  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Put(':messageId')
  async editMessage(
    @Param('messageId') messageId: number,
    @Body() body: { prompt: string; userId: number },
  ): Promise<Message> {
    return this.openaiService.editQuestion(body.userId, messageId, body.prompt);
  }

  @UseGuards(JwtAuthGuard) // Aplicar el guard aquí
  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: number): Promise<void> {
    return this.openaiService.deleteMessage(messageId);
  }

  @Sse('stream')
  async streamResponse(
    @Query('prompt') prompt: string,
    @Query('userId') userId: number,
    @Query('projectId') projectId: number,
    @Query('conversationId') conversationId: number,
  ): Promise<AsyncIterable<string>> {
    console.log('Received params:', {
      prompt,
      userId,
      projectId,
      conversationId,
    });

    return this.openaiService.streamResponse(
      prompt,
      userId,
      projectId,
      conversationId,
    );
  }
}

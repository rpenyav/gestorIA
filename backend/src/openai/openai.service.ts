import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Conversation } from '../entities/conversation.entity';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Crear un nuevo proyecto
  async createProject(
    userId: number,
    name: string,
    description?: string,
  ): Promise<Project> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const project = this.projectRepository.create({
      name,
      description,
      user,
    });

    return this.projectRepository.save(project);
  }

  // Obtener proyectos de un usuario
  async getProjectsByUser(userId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  // Obtener un proyecto por ID
  async getProjectById(projectId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['user'],
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  // Actualizar un proyecto
  async updateProject(
    projectId: number,
    name: string,
    description?: string,
  ): Promise<Project> {
    const project = await this.getProjectById(projectId);

    project.name = name;
    project.description = description;

    return this.projectRepository.save(project);
  }

  // Eliminar un proyecto
  async deleteProject(projectId: number): Promise<void> {
    const project = await this.getProjectById(projectId);
    await this.projectRepository.remove(project);
  }

  // Crear una nueva conversación
  async createConversation(
    userId: number,
    projectId: number,
    title: string,
    description?: string,
  ): Promise<Conversation> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!user || !project) {
      throw new Error('User or Project not found');
    }

    const conversation = this.conversationRepository.create({
      title,
      description,
      user, // Asocia la conversación con el usuario
      project, // Asocia la conversación con el proyecto
    });

    return this.conversationRepository.save(conversation);
  }

  // Editar un mensaje
  async editQuestion(
    userId: number,
    messageId: number,
    newPrompt: string,
  ): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, user: { id: userId } },
      relations: ['user', 'conversation'],
    });

    if (!message) {
      throw new Error('Message not found');
    }

    // Actualizar el mensaje con el nuevo prompt
    message.prompt = newPrompt;
    message.response = await this.getOpenAIResponse(newPrompt); // Generar una nueva respuesta
    message.updatedAt = new Date(); // Marcar la última actualización

    return this.messageRepository.save(message);
  }

  // Obtener un mensaje por ID
  async getMessageById(messageId: number): Promise<Message> {
    console.log('Message ID received:', messageId); // LOG DEL ID RECIBIDO

    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['user', 'conversation'],
    });

    if (!message) {
      throw new Error(`Message not found with ID: ${messageId}`); // MENSAJE DE ERROR DETALLADO
    }

    return message;
  }

  // Eliminar un mensaje
  async deleteMessage(messageId: number): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new Error('Message not found');
    }

    await this.messageRepository.remove(message);
  }

  // Obtener todas las conversaciones de un proyecto
  async getConversationsByProject(projectId: number): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { project: { id: projectId } },
      relations: ['project', 'user'],
    });
  }

  // Obtener una conversación por ID
  async getConversationById(conversationId: number): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['project', 'user'],
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return conversation;
  }

  // Actualizar una conversación
  async updateConversation(
    conversationId: number,
    title: string,
    description?: string,
  ): Promise<Conversation> {
    const conversation = await this.getConversationById(conversationId);

    conversation.title = title;
    conversation.description = description;

    return this.conversationRepository.save(conversation);
  }

  private async getOpenAIResponse(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS, 10) || 200,
    });

    return response.choices[0]?.message?.content.trim() || '';
  }

  // Eliminar una conversación
  async deleteConversation(conversationId: number): Promise<void> {
    const conversation = await this.getConversationById(conversationId);
    await this.conversationRepository.remove(conversation);
  }

  // Crear un mensaje (una nueva consulta)
  async createNewQuestion(
    prompt: string,
    userId: number,
    projectId: number,
    conversationId: number,
  ): Promise<Message> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!user || !project || !conversation) {
      throw new Error('User, project, or conversation not found');
    }

    const response = await this.getOpenAIResponse(prompt); // Generar respuesta con OpenAI

    const message = this.messageRepository.create({
      prompt,
      response,
      user,
      conversation, // Asocia el mensaje a la conversación
    });

    return this.messageRepository.save(message);
  }

  // Obtener todos los mensajes de una conversación
  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['conversation', 'user'],
    });
  }

  async streamResponse(
    prompt: string,
    userId: number,
    projectId: number,
    conversationId: number,
  ): Promise<AsyncIterable<string>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!user || !project || !conversation) {
      throw new Error('User, project, or conversation not found');
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS, 10) || 200,
    });

    // Transformar el stream de OpenAI en AsyncIterable<string>
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            yield content; // Emitir solo el contenido
          }
        }
      },
    };

    return asyncIterable;
  }
}

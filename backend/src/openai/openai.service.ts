import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { user: { id: userId } },
      relations: ['user'], // Cargar la relación con el usuario si es necesario
    });
  }

  async generateResponse(prompt: string, userId: number): Promise<Message> {
    // Llamar a OpenAI para generar una respuesta
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4', // O text-davinci-003
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });

    // Buscar al usuario
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Guardar el mensaje en la base de datos
    const message = this.messageRepository.create({
      prompt,
      response: response.choices[0].message.content.trim(),
      user, // Relacionar el mensaje con el usuario
    });

    return this.messageRepository.save(message);
  }
}

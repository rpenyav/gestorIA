import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('generate')
  async generate(@Body() body: { prompt: string; userId: number }) {
    const { prompt, userId } = body;
    return this.openaiService.generateResponse(prompt, userId);
  }

  @Get('messages/:userId')
  async getMessages(@Param('userId') userId: number) {
    return this.openaiService.getMessagesByUser(userId);
  }
}

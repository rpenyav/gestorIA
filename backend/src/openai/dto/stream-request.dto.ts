import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StreamRequestDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  projectId: number;

  @IsNumber()
  conversationId: number;
}

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Crear un nuevo usuario
  @Post()
  async createUser(
    @Body() body: { name: string; email: string; password: string },
  ) {
    return this.userService.createUser(body.name, body.email, body.password);
  }

  // Login (verificación de la contraseña)
  // Login (verificación de la contraseña y generación del JWT)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const { email, password } = body;
      const result = await this.userService.login(email, password);

      return result; // Devolvemos el JWT al cliente
    } catch (error) {
      throw error; // NestJS se encargará de manejar el error y devolver la respuesta apropiada
    }
  }
  // Obtener todos los usuarios
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  // Endpoint para obtener el usuario autenticado
  // user.controller.ts
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getAuthenticatedUser(
    @Req() req,
  ): Promise<{ id: number; email: string }> {
    const user = req.user; // Resuelto en el guard
    return {
      id: user.id,
      email: user.email,
    };
  }

  // Obtener un usuario por ID
  @Get(':userId')
  async getUserById(@Param('userId') userId: number): Promise<User> {
    return this.userService.getUserById(userId);
  }

  // Actualizar un usuario
  @Put(':userId')
  async updateUser(
    @Param('userId') userId: number,
    @Body() body: { name: string; email: string; password?: string },
  ): Promise<User> {
    return this.userService.updateUser(
      userId,
      body.name,
      body.email,
      body.password,
    );
  }

  // Eliminar un usuario
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: number): Promise<void> {
    return this.userService.deleteUser(userId);
  }
}

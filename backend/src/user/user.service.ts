import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Crear un nuevo usuario con contraseña encriptada
  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt(10); // Genera un salt con un factor de complejidad de 10
    const hashedPassword = await bcrypt.hash(password, salt); // Encripta la contraseña

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword, // Almacena la contraseña encriptada
    });

    return this.userRepository.save(newUser);
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
  // Verificar la contraseña en el login
  async validateUserPassword(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password'); // Si no se encuentra el usuario, lanzamos un error
    }

    // Compara la contraseña proporcionada con la almacenada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password'); // Si la contraseña no es válida, lanzamos un error
    }

    // Si la validación es exitosa, retornar los datos del usuario (sin la contraseña)
    const { password: _, ...result } = user; // Desestructuramos para no enviar la contraseña
    return result;
  }

  // Login (generar y devolver el JWT)
  async login(email: string, password: string): Promise<any> {
    const user = await this.validateUserPassword(email, password);

    const payload = { email: user.email, role: user.role }; // Cargamos los datos para el payload del JWT

    const accessToken = this.jwtService.sign(payload); // Generamos el JWT

    return { access_token: accessToken }; // Devolvemos el token al cliente
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Obtener un usuario por ID
  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Actualizar un usuario
  async updateUser(
    userId: number,
    name: string,
    email: string,
    password?: string,
  ): Promise<User> {
    const user = await this.getUserById(userId);
    user.name = name;
    user.email = email;
    if (password) user.password = password;
    return this.userRepository.save(user);
  }

  // Eliminar un usuario
  async deleteUser(userId: number): Promise<void> {
    const user = await this.getUserById(userId);
    await this.userRepository.remove(user);
  }
}

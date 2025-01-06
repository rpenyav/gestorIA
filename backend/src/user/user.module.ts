import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(), // Asegúrate de que el ConfigModule esté importado
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Proporciona la clave secreta desde las variables de entorno
      signOptions: { expiresIn: '6h' }, // El token expirará en 6 horas
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController, ManageUserController } from './controllers';
import { UserEntity } from './entities';
import { AuthService, UserService } from './services';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: 'auth@123',
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [AuthController, ManageUserController],
  providers: [AuthService, JwtService, UserService],
  exports: [],
})
export class UserModule {}

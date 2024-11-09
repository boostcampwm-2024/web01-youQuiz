import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UserController } from './users/user.controller';
import { UserRepository } from './users/repositories/user.repository';
import { UserService } from './users/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRepository])],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule {}
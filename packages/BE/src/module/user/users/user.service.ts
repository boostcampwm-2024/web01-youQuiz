import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    // DB repository
    constructor(private readonly userRepository : UserRepository) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        
        // 추후 암호화 bcrypt 사용 예정
        if (user.password !== password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}
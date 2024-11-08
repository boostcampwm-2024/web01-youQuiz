import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    // 로그인
    @Post('login')
    userLogin(): any {
        console.log('login');
        // this.userService.validateUser();
    }

    //회원가입
    // @Post
}
import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}
    // 로그인
    @Post()
    userLogin(): string {
        return this.userService.userLogin();
    }

    //회원가입
    // @Post
}

import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInRequestDto } from './dto';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    // 로그인
    @Post('login')
    @UsePipes(ValidationPipe)
    userLogin(@Body() signInRequestDto : SignInRequestDto) {
        console.log('login');
        // this.userService.validateUser();
    }
}
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
        console.log('userLogin 호출');
        try {
            const email = signInRequestDto.email;
            const password = signInRequestDto.password;        
            console.log('Processing login request', email, password);
            return {
                message: 'Login request received',
                data: signInRequestDto
            };
        } catch (error) {
            console.log('Login error:', error);
            throw error;
        }    
    }

    @Get('test')
    testMethod() {
      console.log('testMethod 호출');
      return 'User Test Method';
    }
    @Post('test-login')
    testLogin(@Body() body: any) {
        console.log('test-login 호출');
        console.log('Received body:', body);
        return body;
    }
}
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateClassRequestDto } from './dto/request/create-class.request.dto';
import { CreateClassResponseDto } from './dto/response/create-class.response.dto';
import { CreateQuizListRequestDto } from './dto/request/create-quizlist.request.dto';
import { UpdateClassRequestDto } from './dto/request/update-class.request.dto';
import { UpdateQuizListRequestDto } from './dto/request/update-quizlist.request.dto';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { GetClassResponseDto } from './dto/response/get-class.response.dto';
// import { ClassResponseDto } from './dto/response/class.response.dto';

@Controller('api')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('classes')
  @UseInterceptors(new TransformInterceptor(GetClassResponseDto))
  async getClasses() {
    const result = await this.quizService.getAllClasses();
    console.log('result:', result);
    return result;
  }

  @Get('classes/:classId/quizzes')
  @UseInterceptors(new TransformInterceptor(CreateClassResponseDto))
  async getQuizzes(@Param('classId') classId: number) {
    return await this.quizService.getQuizzesByClassId(classId);
  }

  @Post('classes')
  @UseInterceptors(new TransformInterceptor(CreateClassResponseDto))
  @UsePipes(ValidationPipe)
  async createClass(@Body() dto: CreateClassRequestDto) {
    const result = await this.quizService.createClass(dto);
    console.log('result:', result);
    return result;
  }

  // @Delete('classes/:classId')
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(new TransformInterceptor(CreateClassResponseDto))
  // async deleteClass(@Param('classId') classId: number) {
  //   return await this.quizService.deleteClass(classId);
  // }

  // @Post('classes/:classId/quizzes')
  // @UsePipes(ValidationPipe)
  // async createQuiz(@Param('classId') classId: number, @Body() dto: CreateQuizListRequestDto) {
  //   return await this.quizService.createQuiz(classId, dto);
  // }

  // @Patch('classes/:classId')
  // @UsePipes(ValidationPipe)
  // async updateClass(@Param('classId') classId: number, @Body() dto: UpdateClassRequestDto) {
  //   return await this.quizService.updateClass(classId, dto);
  // }

  // @Patch('classes/:classId/quizzes')
  // @UsePipes(ValidationPipe)
  // async updateQuiz(@Param('classId') classId: number, @Body() dto: UpdateQuizListRequestDto) {
  //   return await this.quizService.updateQuiz(classId, dto);
  // }
}

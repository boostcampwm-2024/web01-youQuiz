import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateClassRequestDto } from './dto/create-class.request.dto';
import { CreateQuizListRequestDto } from './dto/create-quizlist.request.dto';
import { UpdateClassRequestDto } from './dto/update-class.request.dto';
import { UpdateQuizListRequestDto } from './dto/update-quizlist.request.dto';

@Controller('api')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('classes')
  async getClasses() {
    return await this.quizService.getClasses();
  }

  // class 생성
  @Post('classes')
  @UsePipes(ValidationPipe)
  async createClass(@Body() dto: CreateClassRequestDto) {
    return await this.quizService.createClass(dto);
  }

  @Delete('classes/:classId')
  @UsePipes(ValidationPipe)
  async deleteClass(@Param('classId') classId: number) {
    return await this.quizService.deleteClass(classId);
  }

  @Post('classes/:classId/quizzes')
  @UsePipes(ValidationPipe)
  async createQuiz(@Param('classId') classId: number, @Body() dto: CreateQuizListRequestDto) {
    return await this.quizService.createQuiz(classId, dto);
  }

  @Patch('classes/:classId')
  @UsePipes(ValidationPipe)
  async updateClass(@Param('classId') classId: number, @Body() dto: UpdateClassRequestDto) {
    return await this.quizService.updateClass(classId, dto);
  }

  @Patch('classes/:classId/quizzes')
  @UsePipes(ValidationPipe)
  async updateQuiz(@Param('classId') classId: number, @Body() dto: UpdateQuizListRequestDto) {
    return await this.quizService.updateQuiz(classId, dto);
  }
}

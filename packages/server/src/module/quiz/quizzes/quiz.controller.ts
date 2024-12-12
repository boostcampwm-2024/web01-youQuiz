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
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { ResponseDto } from '../../utils/dto/response.dto';
import { CreateClassRequestDto } from './dto/request/create-class.request.dto';
import { CreateClassResponseDto } from './dto/response/create-class.response.dto';
import { CreateQuizListRequestDto } from './dto/request/create-quizlist.request.dto';
import { GetClassResponseDto } from './dto/response/get-class.response.dto';
import { UpdateClassRequestDto } from './dto/request/update-class.request.dto';
import { UpdateQuizListRequestDto } from './dto/request/update-quizlist.request.dto';

@Controller('api')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('classes')
  @UseInterceptors(new TransformInterceptor(CreateClassResponseDto))
  async createClass(@Body() dto: CreateClassRequestDto) {
    return await this.quizService.createClass(dto);
  }

  @Post('classes/:classId/quizzes')
  @UseInterceptors(new TransformInterceptor(ResponseDto))
  async createQuiz(@Param('classId') classId: number, @Body() dto: CreateQuizListRequestDto) {
    return await this.quizService.createBulkQuizWithChoices(classId, dto);
  }

  @Get('classes')
  @UseInterceptors(new TransformInterceptor(GetClassResponseDto))
  async getClasses() {
    return await this.quizService.getAllClasses();
  }

  @Get('classes/:classId/quizzes')
  @UseInterceptors(new TransformInterceptor(CreateClassResponseDto))
  async getQuizzes(@Param('classId') classId: number) {
    return await this.quizService.getQuizzesByClassId(classId);
  }

  @Patch('classes/:classId')
  @UseInterceptors(new TransformInterceptor(ResponseDto))
  async updateClass(@Param('classId') classId: number, @Body() dto: UpdateClassRequestDto) {
    return await this.quizService.updateClass(classId, dto);
  }

  @Patch('classes/:classId/quizzes')
  @UseInterceptors(new TransformInterceptor(ResponseDto))
  async updateQuiz(@Param('classId') classId: number, @Body() dto: UpdateQuizListRequestDto) {
    return await this.quizService.updateQuiz(classId, dto);
  }

  @Delete('classes/:classId')
  @UseInterceptors(new TransformInterceptor(ResponseDto))
  async deleteClass(@Param('classId') classId: number): Promise<void> {
    return await this.quizService.deleteClass(classId);
  }
}

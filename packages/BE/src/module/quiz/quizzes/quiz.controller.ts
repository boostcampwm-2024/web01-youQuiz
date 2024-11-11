import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { QuizService } from "./quiz.service";
// index.ts barrel file로 처리해도 좋을 듯.
import { CreateClassRequestDto } from "./dto/create-class.request.dto";
import { CreateQuizListRequestDto } from "./dto/create-quizlist.request.dto";

@Controller('api')
export class QuizController {
    constructor( private readonly quizService : QuizService) {}

    // class 생성
    @Post('classes')
    @UsePipes(ValidationPipe)
    async createClass(@Body() dto : CreateClassRequestDto) {
        return await this.quizService.createClass(dto);
    }

    @Post('classes/:classId/quizzes')
    @UsePipes(ValidationPipe)
    async createQuiz(@Param('classId') classId: number,
    @Body() dto : CreateQuizListRequestDto) {
        return await this.quizService.createQuiz(classId, dto);
    }

    // @Delete('delete-class')
    // @UsePipes(ValidationPipe)
    // async deleteQuiz(@Body() dto : CreateClassRequestDto) {
    //     return await this.quizService.deleteClass(dto);
    // }
}
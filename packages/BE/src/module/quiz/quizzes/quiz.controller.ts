import { Body, Controller, Delete, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { QuizService } from "./quiz.service";
// index.ts barrel file로 처리해도 좋을 듯.
import { CreateClassRequestDto } from "./dto/create-class.request.dto";
import { CreateQuizListRequestDto } from "./dto/create-quizlist.request.dto";

@Controller('api/quiz')
export class QuizController {
    constructor( private readonly quizService : QuizService) {}

    // class 생성
    @Post('create-class')
    @UsePipes(ValidationPipe)
    async createClass(@Body() dto : CreateClassRequestDto) {
        return await this.quizService.createClass(dto);
    }

    @Post('create-quiz')
    @UsePipes(ValidationPipe)
    async createQuiz(@Body() dto : CreateQuizListRequestDto) {
        return await this.quizService.createQuiz(dto);
    }

    // @Delete('delete-class')
    // @UsePipes(ValidationPipe)
    // async deleteQuiz(@Body() dto : CreateClassRequestDto) {
    //     return await this.quizService.deleteClass(dto);
    // }
}
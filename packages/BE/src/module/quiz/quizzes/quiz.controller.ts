import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { CreateClassRequestDto } from "./dto/create-class.request.dto";

@Controller('api/quiz')
export class QuizController {
    constructor( private readonly quizService : QuizService) {}

    // class 생성
    @Post('create-class')
    @UsePipes(ValidationPipe)
    async createQuiz(@Body() createClassRequestDto : CreateClassRequestDto) {
        // const response = await this.quizService.createQuiz();
        // return response;
    }
}
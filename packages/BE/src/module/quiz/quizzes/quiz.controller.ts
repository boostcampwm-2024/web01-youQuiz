import { Controller } from "@nestjs/common";
import { QuizService } from "./quiz.service";

@Controller('api/quiz')
export class QuizController {
    constructor( private readonly quizService : QuizService) {}
}
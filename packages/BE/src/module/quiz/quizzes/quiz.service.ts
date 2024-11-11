import { Injectable, HttpException, HttpStatus, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QuizRepository } from './repositories/quiz.repository';
import { ChoiceRepository } from './repositories/choice.repository';
import { ClassRepository } from './repositories/class.repository';
import { CreateClassRequestDto } from './dto/create-class.request.dto';    
import { CreateQuizListRequestDto } from './dto/create-quizlist.request.dto';
import { CreateQuizRequestDto } from './dto/create-quiz.request.dto';
import { CreateChoiceRequestDto } from './dto/create-choice.request.dto';
import { ResponseDto } from '../../utils/dto/response.dto';
import { Quiz } from './entities/quiz.entity';
import { Class } from './entities/class.entity';
import { Choice } from './entities/choice.entity';

@Injectable()
export class QuizService {
    constructor(
        private readonly quizRepository: QuizRepository,
        private readonly choiceRepository: ChoiceRepository,
        private readonly classRepository: ClassRepository,
        private readonly dataSource: DataSource,
    ) {}

    async createClass(createClassRequestDto: CreateClassRequestDto): Promise<void> {
        try {
            const classData = await this.classRepository.create({
                title: createClassRequestDto.title,
                description: createClassRequestDto.description,
            });
        } catch (error) {
            console.error('error:', error);
        }
    }

    // dto가 여러개라서 처리하기 좀 그러네 quiz, choice는 dto가 아니라 인터페이스로 구현하는게 좋지않을까라는 생각...?
    async createQuiz(classId: number, quizData: CreateQuizListRequestDto): Promise<ResponseDto> {
        // 그럼 이 컨트롤러에서 dto 구분이 힘들다
        // 너무 이 메서드에 책임이 많은게 아닌가 라는 생각도 든다.
        // const queryRunner = this.dataSource.createQueryRunner();
        // await queryRunner.connect();
        // await queryRunner.startTransaction();
        try {
            // class_id가 유효한지 확인
            const is_valid_class = await this.classRepository.findClassById(classId);
            if (!is_valid_class) {
                throw new Error(`Class with ID ${classId} not found`);
            }

            await Promise.all(
                quizData.quizzes.map(async (quiz) => {
                    const quizEntity = await this.quizRepository.create(classId, quiz);
                    quiz.choices.map(async (choice) => {
                        this.choiceRepository.create(quizEntity.id, choice);
                    });
                }
            ));

            // await queryRunner.commitTransaction();


            return {
                success: true,
                message: 'Quiz created successfully',
            };
        } catch (error) {
            // await queryRunner.rollbackTransaction();
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: `${error}`,
            }, HttpStatus.FORBIDDEN, {
                cause: error
            });
        }        
        // } finally {
        //     await queryRunner.release();
        // }
    }

    async findAll(): Promise<Quiz[]> {
        return this.quizRepository.findAll();
    }

    // async findById(id: number): Promise<Quiz> {
    //     const quiz = await this.quizRepository.findById(id);
    //     if (!quiz) {
    //         throw new NotFoundException(`Quiz with ID ${id} not found`);
    //     }
    //     return quiz;
    // }
    // async updateQuiz(id: number, updateQuizDto: UpdateQuizDto): Promise<Quiz> {}

    // async deleteQuiz(id: number): Promise<void> {}

}
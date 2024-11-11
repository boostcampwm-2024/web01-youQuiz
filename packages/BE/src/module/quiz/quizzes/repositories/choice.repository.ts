import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Choice } from '../entities/choice.entity';
import { CreateChoiceRequestDto } from "../dto/create-choice.request.dto";

@Injectable()
export class ChoiceRepository {
    constructor(
        @InjectRepository(Choice)
        private readonly repository: Repository<Choice>
    ) {}

    async create(quiz_id: number, choiceData: CreateChoiceRequestDto): Promise<Choice> {
        const { position, content, isCorrect: is_correct } = choiceData;
        const choiceEntity = this.repository.create({
            quiz_id,
            position,
            content,
            is_correct,
        });
        return await this.repository.save(choiceEntity);
    }


    async findById(id: number): Promise<Choice> {
        return this.repository.findOne({ where: { id } });
    }

    async findAll(): Promise<Choice[]> {
        return this.repository.find();
    }
}
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Choice } from '../entities/choice.entity';

@Injectable()
export class ChoiceRepository {
    constructor(
        @InjectRepository(Choice)
        private readonly repository: Repository<Choice>
    ) {}

    async create(choice: Partial<Choice>): Promise<Choice> {
        return this.repository.save(choice);
    }

    async findById(id: number): Promise<Choice> {
        return this.repository.findOne({ where: { id } });
    }

    async findAll(): Promise<Choice[]> {
        return this.repository.find();
    }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../entities/class.entity';

@Injectable()
export class ClassRepository {
    constructor(
        @InjectRepository(Class)
        private readonly repository: Repository<Class>
    ) {}

    async create(classData: Partial<Class>): Promise<Class> {
        const {title, description} = classData;
        const classEntity = this.repository.create({
            title,
            description,
        });
        return this.repository.save(classEntity);
    }

    async findById(id: number): Promise<Class> {
        return this.repository.findOne({ where: { id } });
    }

    async findClassById(id: number): Promise<Class> {
        return this.repository.findOne({ where: { id } });
    }

    async findAll(): Promise<Class[]> {
        return this.repository.find();
    }

    async deleteById(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
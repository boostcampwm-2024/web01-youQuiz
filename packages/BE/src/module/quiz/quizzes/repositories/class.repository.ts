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
        return this.repository.save(classData);
    }

    // async delete(classData: Partial<Class>): Promise<void> {
    //     return this.repository.delete(classData);
    // }

    async findById(id: number): Promise<Class> {
        return this.repository.findOne({ where: { id } });
    }

    async findClassById(id: number): Promise<Class> {
        return this.repository.findOne({ where: { id } });
    }

    async findAll(): Promise<Class[]> {
        return this.repository.find();
    }
}
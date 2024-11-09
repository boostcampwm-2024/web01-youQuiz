import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Class } from '../entities/class.entity';

@Injectable()
export class ClassRepository extends Repository<Class> {
    constructor(private readonly dataSource: DataSource) {
        super(Class, dataSource.createEntityManager());
    }
}
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { QuizType } from '../utils/quiz-type.enum';

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    class_id: number;

    @Column()
    content: string;

    @Column({
        type: 'enum',
        enum: QuizType,
        default: QuizType.TF,
    })
    quiz_type: QuizType;

    @Column()
    time_limit: number;

    @Column()
    point: number;

    @Column()
    position: number

    @Column()
    created_at: Date;
}
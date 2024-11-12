import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Choice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quiz_id: number;

    @Column()
    content: string;

    @Column()
    is_correct: boolean;

    @Column()
    position: number;

    @Column()
    created_at: Date;
}
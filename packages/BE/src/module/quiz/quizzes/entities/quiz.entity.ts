import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    class_id: number;

    @Column()
    position: number

    @Column()
    content: string;

    @Column()
    time_limit: number;

    @Column()
    point: number;

    @Column()
    question_type: string;  // 퀴즈 타입에 따른 구분이 가능한 String Enum 혹은 정수로 해도 좋을 것 같음

    // @Column()
    // position: number;
}
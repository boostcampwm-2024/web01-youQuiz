import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizType } from '../utils/quiz-type.enum';
import { Choice } from './choice.entity';
import { Class } from './class.entity';

@Entity('quiz')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'class_id' })
  classId: number;

  @Column()
  content: string;

  @Column({
    name: 'quiz_type',
    type: 'enum',
    enum: QuizType,
    default: QuizType.TF,
  })
  quizType: QuizType;

  @Column({ name: 'time_limit' })
  timeLimit: number;

  @Column()
  point: number;

  @Column()
  position: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Choice, (choice) => choice.quiz, {
    cascade: true,
    eager: false,
  })
  choices: Choice[];

  @ManyToOne(() => Class, (cls) => cls.quizzes)
  @JoinColumn([{ name: 'class_id', referencedColumnName: 'id' }])
  class: Class;
}

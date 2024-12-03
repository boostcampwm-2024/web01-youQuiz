import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity('choice')
export class Choice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quiz_id' })
  quizId: number;

  @Column()
  content: string;

  @Column({ name: 'is_correct' })
  isCorrect: boolean;

  @Column()
  position: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.choices)
  @JoinColumn({ name: 'quiz_id', referencedColumnName: 'id' })
  quiz: Quiz;
}

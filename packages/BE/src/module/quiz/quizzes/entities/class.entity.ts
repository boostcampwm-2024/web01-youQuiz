import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // uesr_id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Quiz, quiz => quiz.class, {
    cascade: true,
    eager: false
  })
  quizzes: Quiz[];
}
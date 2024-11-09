import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClassEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creator_id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    created_at: Date;
}
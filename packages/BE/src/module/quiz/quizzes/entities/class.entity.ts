import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Class {
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
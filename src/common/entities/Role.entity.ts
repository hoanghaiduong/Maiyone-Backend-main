import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: User[];
}

import { Post } from 'src/common/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './Service.entity';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
  @Column({ nullable: true })
  logo: string;

  @OneToMany(() => Service, (service) => service.provider, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  services: Service[];
  @OneToMany(() => Post, (post) => post.provider, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: Post[];
}

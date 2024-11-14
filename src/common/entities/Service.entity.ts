import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category.entity";
import { Post } from "src/common/entities/post.entity";

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.services)
  @JoinColumn()
  category: Category;

  @Column()
  path: string;

  @Column({ nullable: true })
  icon: string;

  @OneToMany(() => Post, (post) => post.service,{onDelete:"CASCADE",onUpdate:"CASCADE"})
  posts: Post[];
}
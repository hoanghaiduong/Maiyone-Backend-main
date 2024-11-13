import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./Service.entity";
import { Post } from "src/posts/entities/post.entity";

/** Entity for Category */
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  path: string;

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
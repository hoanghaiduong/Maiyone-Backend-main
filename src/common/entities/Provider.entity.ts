import { Post } from "src/common/entities/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Post, (post) => post.provider,{onDelete:"CASCADE",onUpdate:"CASCADE"})
  posts: Post[];
}

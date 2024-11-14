import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./Service.entity";
import { Post } from "src/common/entities/post.entity";

/** Entity for Category */
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:false,unique:true})
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({nullable:false,unique:true})
  path: string;

  @OneToMany(() => Service, (service) => service.category,{onDelete:"CASCADE",onUpdate:"CASCADE"})
  services: Service[];

  @OneToMany(() => Post, (post) => post.category,{onDelete:"CASCADE",onUpdate:"CASCADE"})
  posts: Post[];
}
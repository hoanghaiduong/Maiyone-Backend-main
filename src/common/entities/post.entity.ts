import { Category } from "src/common/entities/Category.entity";
import { Provider } from "src/common/entities/Provider.entity";
import { Service } from "src/common/entities/Service.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Category, (category) => category.posts, { nullable: true })
  @JoinColumn()
  category: Category;


  @ManyToOne(() => Provider, (provider) => provider.posts, { nullable: true })
  @JoinColumn()
  provider: Provider;
}

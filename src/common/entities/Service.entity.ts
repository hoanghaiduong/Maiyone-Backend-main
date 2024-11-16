import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category.entity';
import { Post } from 'src/common/entities/post.entity';
import { Provider } from './Provider.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: false })
  path: string;
  @Column({ nullable: true })
  description?: string;
  @Column({ nullable: true })
  thumbnail?: string;
  @Column({ nullable: true, type: 'json' })
  images?: string[];

  @ManyToOne(() => Category, (category) => category.services, {
    nullable: false,
  })
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Provider, (provider) => provider.services, {
    nullable: false,
  })
  @JoinColumn()
  provider: Provider;
}

import { Category } from 'src/common/entities/Category.entity';
import { Provider } from 'src/common/entities/Provider.entity';
import { Service } from 'src/common/entities/Service.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditableEntity } from './Audit.entity';

@Entity()
export class Post extends AuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'longtext' })
  content: string;
  @Column({ nullable: true })
  thumbnail?: string;
  @Column({ nullable: true, type: 'json' })
  images?: string[];

  @ManyToOne(() => Category, (category) => category.posts, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Service, (service) => service.posts, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  service: Service;
  @ManyToOne(() => Provider, (provider) => provider.posts, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  provider: Provider;
}

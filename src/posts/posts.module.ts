import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../common/entities/post.entity';
import { Category } from 'src/common/entities/Category.entity';
import { Provider } from 'src/common/entities/Provider.entity';
import { Service } from 'src/common/entities/Service.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { ProvidersService } from 'src/providers/providers.service';
import { ServicesService } from 'src/services/services.service';

@Module({
  imports:[TypeOrmModule.forFeature([Post,Category,Provider,Service])],
  controllers: [PostsController],
  providers: [PostsService,CategoriesService,ProvidersService,ServicesService],
  exports:[PostsService]
})
export class PostsModule {}

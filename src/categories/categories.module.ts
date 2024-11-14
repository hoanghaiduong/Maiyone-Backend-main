import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/common/entities/Category.entity';
import { CategoriesController } from './categories.controller';

@Module({
  imports:[TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports:[CategoriesService]
})
export class CategoriesModule {}

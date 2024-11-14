import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { Meta } from 'src/common/pagination/meta.dto';
import { Category } from 'src/common/entities/Category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const queryRunner: QueryRunner = this.categoryRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = queryRunner.manager.create(Category, createCategoryDto);
      const savedCategory = await queryRunner.manager.save(category);

      await queryRunner.commitTransaction();
      return savedCategory;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Category>> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (pagination.search) {
      queryBuilder.where('category.name LIKE :search', { search: `%${pagination.search}%` });
    }

    queryBuilder.skip(pagination.skip).take(pagination.take);

    if (pagination.order) {
      for (const [key, value] of Object.entries(pagination.order)) {
        if (['ASC', 'DESC'].includes(value.toUpperCase())) {
          queryBuilder.addOrderBy(`category.${key}`, value.toUpperCase() as 'ASC' | 'DESC');
        }
      }
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel(entities, meta);
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const queryRunner: QueryRunner = this.categoryRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await queryRunner.manager.findOne(Category, { where: { id } });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const updatedCategory = queryRunner.manager.merge(Category, category, updateCategoryDto);
      const savedCategory = await queryRunner.manager.save(updatedCategory);

      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Category not found');
    }
    
  }
}
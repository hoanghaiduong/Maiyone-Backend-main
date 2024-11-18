import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/common/entities/Service.entity';
import { QueryRunner, Repository } from 'typeorm';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { ProvidersService } from 'src/providers/providers.service';
import { arrayNotEmpty, isNotEmpty } from 'class-validator';
import { MulterUtils } from 'src/common/utils/multer.utils';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly categoryService: CategoriesService,
    private readonly providerService: ProvidersService,
  ) {}
  async create(
    createServiceDto: CreateServiceDto,
    images: Express.Multer.File[],
    thumbnail: Express.Multer.File,
  ): Promise<Service> {
    const queryRunner: QueryRunner =
      this.serviceRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await this.categoryService.findOne(
        createServiceDto.categoryId,
      );

      const provider = await this.providerService.findOne(
        createServiceDto.providerId,
      );

      const service = queryRunner.manager.create(Service, {
        ...createServiceDto,
        category,
        provider,
        thumbnail: isNotEmpty(thumbnail)
          ? MulterUtils.convertPathToUrl(thumbnail.path)
          : null,
        images: arrayNotEmpty(images)
          ? MulterUtils.convertArrayPathToUrl(images.map((item) => item.path))
          : null,
      });

      const savedService = await queryRunner.manager.save(service);
      await queryRunner.commitTransaction();
      return savedService;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (thumbnail?.path) {
        MulterUtils.deleteFile(thumbnail.path);
      }

      if (images && images.length > 0) {
        try {
          console.log(
            `Attempting to delete images: ${images.map((item) => item.path)}`,
          );
          MulterUtils.deleteFiles(images.map((item) => item.path));
        } catch (err) {
          console.error(`Failed to delete images`, err);
        }
      }

      throw new BadRequestException({
        message: error.message,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Service>> {
    const queryBuilder = this.serviceRepository.createQueryBuilder('service').leftJoinAndSelect('service.provider','provider').leftJoinAndSelect('service.category','category');

    if (pagination.search) {
      queryBuilder.where('service.name LIKE :search', {
        search: `%${pagination.search}%`,
      });
    }

    queryBuilder.skip(pagination.skip).take(pagination.take);

    if (pagination.order) {
      for (const [key, value] of Object.entries(pagination.order)) {
        if (['ASC', 'DESC'].includes(value.toUpperCase())) {
          queryBuilder.addOrderBy(
            `service.${key}`,
            value.toUpperCase() as 'ASC' | 'DESC',
          );
        }
      }
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel(entities, meta);
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }
  async findOneRelation(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['category', 'provider'],
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }
  async findBySlug(path: string): Promise<Service> {
   
    try {
      const service = await this.serviceRepository.findOne({
        where: { path},
        relations: ['category', 'provider'],
      });
      if (!service) {
        throw new NotFoundException('Service not found');
      }
      return service;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    images?: Express.Multer.File[],
    thumbnail?: Express.Multer.File,
  ): Promise<Service> {
    const queryRunner: QueryRunner =
      this.serviceRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lấy thông tin Service hiện tại
      const service = await queryRunner.manager.findOne(Service, {
        where: { id },
        relations: ['category', 'provider'],
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      // Xử lý thay đổi category
      if (service.category.id !== updateServiceDto.categoryId) {
        const category = await this.categoryService.findOne(
          updateServiceDto.categoryId,
        );
        if (!category) {
          throw new NotFoundException('Category not found');
        }
        service.category = category;
      }

      // Xử lý thay đổi provider
      if (service.provider.id !== updateServiceDto.providerId) {
        const provider = await this.providerService.findOne(
          updateServiceDto.providerId,
        );
        if (!provider) {
          throw new NotFoundException('Provider not found');
        }
        service.provider = provider;
      }

      // Xóa ảnh cũ (nếu có) trước khi gán ảnh mới
      if (thumbnail && service.thumbnail) {
        MulterUtils.deleteFile(service.thumbnail);
      }
      if (images && service.images) {
        MulterUtils.deleteFiles(service.images);
      }

      // Gán ảnh mới
      const updatedService = queryRunner.manager.merge(Service, service, {
        ...updateServiceDto,
        thumbnail: isNotEmpty(thumbnail)
          ? MulterUtils.convertPathToUrl(thumbnail.path)
          : service.thumbnail, // Giữ lại ảnh cũ nếu không upload ảnh mới
        images: arrayNotEmpty(images)
          ? MulterUtils.convertArrayPathToUrl(images.map((item) => item.path))
          : service.images, // Giữ lại danh sách ảnh cũ nếu không upload ảnh mới
      });

      // Lưu thông tin cập nhật
      const savedService = await queryRunner.manager.save(updatedService);

      await queryRunner.commitTransaction();
      return savedService;
    } catch (error) {
      console.error('Error occurred:', error);

      // Xóa ảnh mới tải lên nếu xảy ra lỗi
      if (isNotEmpty(thumbnail?.path)) {
        MulterUtils.deleteFile(thumbnail.path);
      }
      if (arrayNotEmpty(images)) {
        MulterUtils.deleteFiles(images.map((item) => item.path));
      }

      await queryRunner.rollbackTransaction();
      throw new BadRequestException({
        message: error.message,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.serviceRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Service not found');
    }
  }
}

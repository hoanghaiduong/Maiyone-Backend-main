import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly categoryService: CategoriesService,
    private readonly providerService: ProvidersService,
  ) {}
  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const queryRunner: QueryRunner =
      this.serviceRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const category = await this.categoryService.findOne(
        createServiceDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      const provider = await this.providerService.findOne(
        createServiceDto.providerId,
      );
      if (!provider) {
        throw new NotFoundException('Provider not found');
      }
      const service = queryRunner.manager.create(Service, {
        ...createServiceDto,
        category,
        provider,
      });

      const savedService = await queryRunner.manager.save(service);
      await queryRunner.commitTransaction();
      return savedService;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Service>> {
    const queryBuilder = this.serviceRepository.createQueryBuilder('service');

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

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const queryRunner: QueryRunner =
      this.serviceRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const service = await queryRunner.manager.findOne(Service, {
        where: { id },
        relations:['category','provider']
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }
      if (service.category.id !== updateServiceDto.categoryId) {
        const category = await this.categoryService.findOne(
          updateServiceDto.categoryId,
        );
        if (!category) {
          throw new NotFoundException('Category not found');
        }
        service.category = category;
      }
      if(service.provider.id !== updateServiceDto.providerId) {
        const provider = await this.providerService.findOne(
          updateServiceDto.providerId,
        );
        if (!provider) {
          throw new NotFoundException('Provider not found');
        }
        service.provider=provider;
      }

    
      const updatedService = queryRunner.manager.merge(
        Service,
        service,
        updateServiceDto,
      );
      await queryRunner.manager.save(updatedService);

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
    const result = await this.serviceRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Service not found');
    }
  }
}

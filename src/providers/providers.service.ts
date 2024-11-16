import {
  Injectable,
  NotFoundException,
  BadRequestException,

} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from 'src/common/entities/Provider.entity';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';


@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProviderDto: CreateProviderDto): Promise<Provider> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const provider = this.providerRepository.create(createProviderDto);
      const savedProvider = await queryRunner.manager.save(provider);

      await queryRunner.commitTransaction();
      return savedProvider;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error creating provider');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Provider>> {
    const queryBuilder = this.providerRepository.createQueryBuilder('provider');

    if (pagination.search) {
      queryBuilder.where('provider.name LIKE :search', { search: `%${pagination.search}%` });
    }

    queryBuilder.skip(pagination.skip).take(pagination.take);

    if (pagination.order) {
      for (const [key, value] of Object.entries(pagination.order)) {
        if (['ASC', 'DESC'].includes(value.toUpperCase())) {
          queryBuilder.addOrderBy(`provider.${key}`, value.toUpperCase() as 'ASC' | 'DESC');
        }
      }
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel(entities, meta);
  }

  async findOne(id: number): Promise<Provider> {
    const provider = await this.providerRepository.findOne({
      where: { id },
      relations: ['services', 'posts'],
    });
    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
    return provider;
  }

  async update(
    id: number,
    updateProviderDto: UpdateProviderDto,
  ): Promise<Provider> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const provider = await this.findOne(id);
      const updatedProvider = queryRunner.manager.merge(
        Provider,
        provider,
        updateProviderDto,
      );

      await queryRunner.manager.save(updatedProvider);
      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error updating provider');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const provider = await this.findOne(id);
    await this.providerRepository.remove(provider);
  }
}

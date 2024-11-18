import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from 'src/common/entities/Provider.entity';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';
import { MulterUtils } from 'src/common/utils/multer.utils';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class ProvidersService implements OnModuleInit {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    private readonly dataSource: DataSource,
  ) {}
  onModuleInit() {
    //  this.truncateProviders();
  }
  async truncateProviders() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      // Tắt kiểm tra khóa ngoại
      await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0;`);

      // Thực hiện TRUNCATE
      await queryRunner.query(`TRUNCATE TABLE provider;`);

      // Bật lại kiểm tra khóa ngoại
      await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1;`);
    } finally {
      await queryRunner.release();
    }
  }
  async create(
    createProviderDto: CreateProviderDto,
    logo: Express.Multer.File,
  ): Promise<Provider> {
    console.log(logo.path);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    var logoUpload = logo ? MulterUtils.convertPathToUrl(logo.path) : null;
    try {
      Logger.debug('testing');
      const provider = this.providerRepository.create({
        ...createProviderDto,
        logo: logoUpload,
      });
      const savedProvider = await queryRunner.manager.save(provider);

      await queryRunner.commitTransaction();
      return savedProvider;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      MulterUtils.deleteFile(logoUpload);
      console.log(error);

      throw new BadRequestException({
        message: error.message,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Provider>> {
    const queryBuilder = this.providerRepository.createQueryBuilder('provider');

    if (pagination.search) {
      queryBuilder.where('provider.name LIKE :search', {
        search: `%${pagination.search}%`,
      });
    }

    queryBuilder.skip(pagination.skip).take(pagination.take);

    if (pagination.order) {
      for (const [key, value] of Object.entries(pagination.order)) {
        if (['ASC', 'DESC'].includes(value.toUpperCase())) {
          queryBuilder.addOrderBy(
            `provider.${key}`,
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
    logo: Express.Multer.File,
  ): Promise<Provider> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    var uploadLogo =
      isNotEmpty(logo) && MulterUtils.convertPathToUrl(logo.path);
    try {
      const provider = await this.findOne(id);
      isNotEmpty(logo) && MulterUtils.deleteFile(provider.logo);

      const updatedProvider = queryRunner.manager.merge(Provider, provider, {
        ...updateProviderDto,
        logo: isNotEmpty(logo) ? uploadLogo : provider.logo,
      });

      await queryRunner.manager.save(updatedProvider);
      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      MulterUtils.deleteFile(uploadLogo);
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

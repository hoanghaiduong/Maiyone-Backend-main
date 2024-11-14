import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/User.entity';
import { ApiException } from 'src/common/exceptions/api.exception';
import { ErrorMessages } from 'src/common/exceptions/error.code';
import { QueryRunner, Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.dto';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Meta } from 'src/common/pagination/meta.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}
  async onModuleInit() {}
  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new ApiException(ErrorMessages.USER_NOT_FOUND);
    }
    return user;
  }
  async getUserByField(field: keyof User, value: string): Promise<User | null> {
    const searchableFields: Array<keyof User> = [
      'email',
      'username',
      'phoneNumber',
    ];

    // Check if the provided field is in the list of searchable fields
    if (!searchableFields.includes(field)) {
      throw new Error(`Field "${field}" is not searchable.`);
    }

    return this.usersRepository
      .createQueryBuilder('user')
      .where(`user.${field} = :value`, { value })
      .getOne();
  }

  
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner: QueryRunner =
      this.usersRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let user: User | null = null;

    try {
      user = queryRunner.manager.create(User, createUserDto);
      var role = await this.rolesService.findOne(createUserDto.roleId);
      user.role = role;
      const savedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === 'ER_DUP_ENTRY') {
        // Reset AUTO_INCREMENT nếu xảy ra lỗi
        const tableName = this.usersRepository.metadata.tableName;
        const lastId = await queryRunner.query(
          `SELECT AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${tableName}'`,
        );
        await queryRunner.query(
          `ALTER TABLE ${tableName} AUTO_INCREMENT = ${
            lastId[0].AUTO_INCREMENT - 1
          }`,
        );

        throw new ConflictException(
          'User with the given email or username or phone  already exists.',
        );
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (pagination.search) {
      queryBuilder.where(
        'user.username LIKE :search OR user.email LIKE :search',
        {
          search: `%${pagination.search}%`,
        },
      );
    }

    queryBuilder.skip(pagination.skip).take(pagination.take);

    if (pagination.order) {
      for (const [key, value] of Object.entries(pagination.order)) {
        if (['ASC', 'DESC'].includes(value.toUpperCase())) {
          queryBuilder.addOrderBy(
            `user.${key}`,
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
}

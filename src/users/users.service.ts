import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
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
import { MulterUtils } from 'src/common/utils/multer.utils';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}
  async onModuleInit() {}
  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
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
      .leftJoinAndSelect('user.role', 'role')
      .where(`user.${field} = :value`, { value })
      .getOne();
  }

  async createUser(
    createUserDto: CreateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    const queryRunner: QueryRunner =
      this.usersRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let user: User | null = null;

    try {
      user = queryRunner.manager.create(User, {
        ...createUserDto,
        avatar: avatar ? MulterUtils.convertPathToUrl(avatar.path) : null,
      });
      var role = await this.rolesService.findOneByName('USER');
      user.role = role;
      const savedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      MulterUtils.deleteFile(avatar.path);
      throw new BadRequestException({
        message: error.message,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<User>> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.role', 'role');
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

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    const queryRunner: QueryRunner =
      this.usersRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let user: User | null = null;

    try {
      // Lấy thông tin user hiện tại
      user = await queryRunner.manager.findOne(User, {
        where: { id },
        relations: ['role'], // Nếu cần thông tin role
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Xóa avatar cũ nếu có avatar mới
      if (avatar && user.avatar) {
        MulterUtils.deleteFile(user.avatar);
      }

      // Cập nhật thông tin user
      queryRunner.manager.merge(User, user, {
        ...updateUserDto,
        avatar: avatar ? MulterUtils.convertPathToUrl(avatar.path) : null,
      });

      // Cập nhật role nếu cần

      // Lưu thông tin user
      const updatedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Xóa avatar mới nếu xảy ra lỗi
      if (avatar?.path) {
        MulterUtils.deleteFile(avatar.path);
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async deleteUser(id: number): Promise<void> {
    try {
      const user = await this.getUserById(id);
      await this.usersRepository.remove(user);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}

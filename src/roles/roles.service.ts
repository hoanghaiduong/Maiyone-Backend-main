import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/common/entities/Role.entity';
import { PaginationModel } from 'src/common/pagination/pagination.model';
import { Pagination } from 'src/common/pagination/pagination.dto';
import { Meta } from 'src/common/pagination/meta.dto';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit(): Promise<{
    added: Role[];
    skipped: string[];
    errors: string[];
  }> {
    const roles = [
      { name: 'ADMIN' },
      { name: 'USER' },
      { name: 'MANAGER' },
      { name: 'GUEST' },
    ];

    const addedRoles: Role[] = [];
    const skippedRoles: string[] = [];
    const errorMessages: string[] = [];
    const queryRunner: QueryRunner =
      this.roleRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const role of roles) {
        const existingRole = await queryRunner.manager.findOne(Role, {
          where: { name: role.name },
        });
        if (!existingRole) {
          const newRole = await queryRunner.manager.save(Role, role);
          addedRoles.push(newRole);
          Logger.log(`Added new role: ${role.name}`);
        } else {
          skippedRoles.push(role.name);
          Logger.log(`Role already exists: ${role.name}`);
        }
      }

      await queryRunner.commitTransaction();
      return {
        added: addedRoles,
        skipped: skippedRoles,
        errors: errorMessages,
      };
    } catch (error) {
      errorMessages.push(error.message);
      Logger.error(`Error during transaction: ${error}`);
      await queryRunner.rollbackTransaction();
      return {
        added: addedRoles,
        skipped: skippedRoles,
        errors: errorMessages,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pagination: Pagination): Promise<PaginationModel<Role>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
  
    // Thêm điều kiện tìm kiếm (nếu có)
    if (pagination.search) {
      queryBuilder.where('role.name LIKE :name', { name: `%${pagination.search}%` });
    }
  
    // Áp dụng phân trang
    queryBuilder.skip(pagination.skip).take(pagination.take);
  
    // Xử lý sắp xếp
    if (pagination.order && Object.keys(pagination.order).length > 0) {
      for (const [key, value] of Object.entries(pagination.order)) {
        if (['ASC', 'DESC'].includes(value.toUpperCase())) {
          queryBuilder.addOrderBy(`role.${key}`, value.toUpperCase() as 'ASC' | 'DESC');
        }
      }
    }
  
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
  
    const meta = new Meta({ itemCount, pagination });
    return new PaginationModel(entities, meta);
  }
  

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role)
      throw new NotFoundException({
        message: 'Role not found',
      });
    return role;
  }
  async findOneByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ name });
    if (!role)
      throw new NotFoundException({
        message: 'Role not found',
      });
    return role;
  }
}

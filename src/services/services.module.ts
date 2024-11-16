import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/common/entities/Service.entity';
import { Category } from 'src/common/entities/Category.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Provider } from 'src/common/entities/Provider.entity';
import { ProvidersService } from 'src/providers/providers.service';

@Module({
  imports:[TypeOrmModule.forFeature([Service,Category,Provider])],
  controllers: [ServicesController],
  providers: [ServicesService,CategoriesService,ProvidersService],
  exports:[ServicesService]
})
export class ServicesModule {}

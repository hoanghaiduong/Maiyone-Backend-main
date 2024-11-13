import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/common/entities/Service.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}

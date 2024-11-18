import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './common/config/validation';
import { DatabaseModule } from './common/config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { ServicesModule } from './services/services.module';
import { ProvidersModule } from './providers/providers.module';
import { PostsModule } from './posts/posts.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`, `.env.${process.env.NODE_ENV}`], // load env
      isGlobal: true,
      validationSchema,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    CategoriesModule,
    ServicesModule,
    ProvidersModule,
    PostsModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

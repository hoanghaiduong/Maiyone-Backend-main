import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource } from "typeorm-transactional";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              return {
                type: "mysql",
                port: configService.get<number>("MYSQL_PORT"),
                host: configService.get<string>("MYSQL_HOST"),
                username: configService.get<string>("MYSQL_USER"),
                password: configService.get<string>("MYSQL_PASSWORD"),
                database: configService.get<string>("MYSQL_DB"),
                entities: [__dirname + "/**/*.entity{.ts,.js}"],
                synchronize: true,
                logging: true,
                autoLoadEntities: true,
              };
            },
            async dataSourceFactory(options) {
              if (!options) {
                throw new Error('Invalid options passed');
              }
              return addTransactionalDataSource(new DataSource(options));
            },
          }),
    ],
    providers: [],
    exports: []
})
export class DatabaseModule { }
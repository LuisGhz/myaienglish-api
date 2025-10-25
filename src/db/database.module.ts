import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvService } from '../config/env.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        host: envService.dbHost,
        port: envService.dbPort,
        username: envService.dbUsername,
        password: envService.dbPassword,
        database: envService.dbName,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: envService.nodeEnv === 'development',
        logging: envService.nodeEnv === 'development',
      }),
    }),
  ],
})
export class DatabaseModule { }

import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from './env.validation';
import { EnvService } from './env.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
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
  providers: [EnvService],
  exports: [EnvService],
})
export class ConfigModule {}

import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('NODE_ENV') === 'test'
            ? configService.get<string>('DB_TEST_HOST')
            : configService.get<string>('DB_HOST'),
        useNewUrlParser: true,
        user:
          configService.get<string>('NODE_ENV') === 'test'
            ? configService.get<string>('DB_TEST_USER')
            : configService.get<string>('DB_USER'),
        pass:
          configService.get<string>('NODE_ENV') === 'test'
            ? configService.get<string>('DB_TEST_PASSWORD')
            : configService.get<string>('DB_PASSWORD'),
        dbName:
          configService.get<string>('NODE_ENV') === 'test'
            ? configService.get<string>('DB_TEST_NAME')
            : configService.get<string>('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

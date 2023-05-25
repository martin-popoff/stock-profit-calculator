import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './util/config';
import { DBConnService } from './util/db.service';

@Module({
  imports: [
    StockModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DBConnService,
    }),
  ],
})
export class AppModule {}

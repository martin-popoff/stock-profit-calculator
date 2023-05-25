import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { PriceModule } from './price/price.module';
import { StockPrice } from './price/entities/stockPrice.entity';

@Module({
  imports: [PriceModule, TypeOrmModule.forFeature([Stock, StockPrice])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}

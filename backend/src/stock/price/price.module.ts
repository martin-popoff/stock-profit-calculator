import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from '../entities/stock.entity';
import { StockPrice } from './entities/stockPrice.entity';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, StockPrice])],
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PriceService } from './price.service';
import {
  FindStockPriceDto,
  StockPriceDto,
  MockStockPriceDto,
  CalcStockPriceDto,
} from './dto';
import { Stock } from '../entities/stock.entity';
import { StockPrice } from './entities/stockPrice.entity';

@Controller('stock/:id/price')
export class PriceController {
  constructor(private priceService: PriceService) {}
  @Get('calc')
  async calc(
    @Param('id', ParseIntPipe) id: number,
    @Query() calcStockPriceDto: CalcStockPriceDto,
  ) {
    const answer = await this.priceService.calc(calcStockPriceDto, id);
    if (!answer) {
      throw new HttpException(
        `No stock prices found within the provided time span.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return answer;
  }

  @Get(':priceId')
  findOne(@Param('priceId', ParseIntPipe) id: number) {
    return this.priceService.findOne(id);
  }

  @Get()
  async find(
    @Param('id', ParseIntPipe) id: number,
    @Query() findStockPriceDto: FindStockPriceDto,
  ): Promise<StockPrice[]> {
    const stockPrices: StockPrice[] = await this.priceService.find(
      findStockPriceDto,
      id,
    );
    if (stockPrices.length === 0) {
      throw new HttpException(
        `There are no stock prices for stock with id: '${id}'.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return stockPrices;
  }

  @Post()
  async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createStockPriceDto: StockPriceDto,
  ) {
    const stock: Stock = await this.priceService.findOneStock(id);
    try {
      const createdPrice = await this.priceService.create(
        createStockPriceDto,
        stock,
      );
      return createdPrice;
    } catch (err) {
      throw new HttpException(
        `Price for stock '${stock.name}' with timestamp '${createStockPriceDto.timestamp}' already exists.`,
        HttpStatus.CONFLICT,
      );
    }
  }

  @Post('mock')
  async mock(
    @Param('id', ParseIntPipe) id: number,
    @Body() mockStockPriceDto: MockStockPriceDto,
  ) {
    const stock: Stock = await this.priceService.findOneStock(id);
    try {
      const createdPrice = await this.priceService.mock(
        mockStockPriceDto,
        stock,
      );
      return createdPrice;
    } catch (err) {
      throw new HttpException(
        `Creating mock data for '${stock.name}' was met with a conflict for a timestamp.`,
        HttpStatus.CONFLICT,
      );
    }
  }

  @Delete()
  async delete(@Param('id', ParseIntPipe) id: number) {
    const stock: Stock = await this.priceService.findOneStock(id);
    try {
      const deletedPrice = await this.priceService.delete(stock);
      return deletedPrice;
    } catch (err) {
      throw new HttpException(
        `Creating mock data for '${stock.name}' was met with a conflict for a timestamp.`,
        HttpStatus.CONFLICT,
      );
    }
  }
}

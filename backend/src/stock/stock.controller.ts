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
import { StockService } from './stock.service';
import { FindStockDto, StockDto } from './dto';
import { Stock } from './entities/stock.entity';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('test')
  test(@Body() dto: StockDto) {
    return this.stockService.test(dto);
  }

  @Post()
  async create(@Body() createStockDto: StockDto): Promise<Stock> {
    try {
      const createdStock = await this.stockService.create(createStockDto);
      return createdStock;
    } catch (err) {
      throw new HttpException(
        `Stock with name '${createStockDto.name}' or symbol '${createStockDto.symbol}' already exists.`,
        HttpStatus.CONFLICT,
      );
    }
  }

  @Get()
  async find(@Query() findStockDto: FindStockDto): Promise<Stock[]> {
    const stocks: Stock[] = await this.stockService.find(findStockDto);
    return stocks;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Stock> {
    const stock: Stock = await this.stockService.findOne(id);
    if (!stock) {
      throw new HttpException(
        `Stock with id '${id}' was not found and could not be deleted.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return stock;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const stock: Stock = await this.stockService.findOne(id);
    if (!stock) {
      throw new HttpException(
        `Stock with id '${id}' was not found and could not be deleted.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return stock;
  }
}

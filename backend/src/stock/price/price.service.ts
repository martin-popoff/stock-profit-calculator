import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from '../entities/stock.entity';
import { StockPrice } from './entities/stockPrice.entity';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import {
  CalcStockPriceDto,
  FindStockPriceDto,
  MockStockPriceDto,
  StockPriceDto,
} from './dto';
import { timestamp } from 'rxjs';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(StockPrice)
    private priceRepository: Repository<StockPrice>,
  ) {}

  async findOneStock(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findOneBy({ id: id });
    if (!stock) {
      throw new HttpException(
        `Stock with id '${id}' was not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return stock;
  }

  async findOne(id: number): Promise<StockPrice> {
    return await this.priceRepository.findOneBy({ id: id });
  }

  async find(
    findStockPriceDto: FindStockPriceDto,
    id: number,
  ): Promise<StockPrice[]> {
    const take = findStockPriceDto.limit;
    const skip = findStockPriceDto.offset * findStockPriceDto.limit;
    return await this.priceRepository.find({
      where: {
        stock: {
          id,
        },
      },
      take,
      skip,
    });
  }

  test(createStockPriceDto: StockPriceDto) {
    return createStockPriceDto.timestamp;
  }

  async create(
    createStockPriceDto: StockPriceDto,
    stock: Stock,
  ): Promise<StockPrice> {
    const stockPrice = new StockPrice();
    stockPrice.timestamp = createStockPriceDto.timestamp;
    stockPrice.price = createStockPriceDto.price;
    stockPrice.stock = stock;

    const createdStockPrice = await this.priceRepository.save(stockPrice);
    return createdStockPrice;
  }

  async delete(stock: Stock): Promise<any> {
    await this.priceRepository.delete({
      stock: stock,
    });
  }

  async mock(
    mockStockPriceDto: MockStockPriceDto,
    stock: Stock,
  ): Promise<void> {
    let price = Math.random() * 600;
    const stockPrices = [];
    for (
      let i = mockStockPriceDto.start;
      i < mockStockPriceDto.start + mockStockPriceDto.ammount;
      i++
    ) {
      const priceChange = Math.round(Math.random() * 2000) / 100 - 10;
      if (price + priceChange < 0) price -= priceChange;
      else price += priceChange;
      const stockPrice = new StockPrice();
      stockPrice.timestamp = i;
      stockPrice.price = Number(price.toFixed(2));
      stockPrice.stock = stock;
      stockPrices.push(stockPrice);
    }

    await this.priceRepository.save(stockPrices);
  }

  async calc(calcStockPriceDto: CalcStockPriceDto, id: number) {
    const stockPrices: StockPrice[] = await this.priceRepository.find({
      where: {
        stock: {
          id,
        },
        timestamp: Between(calcStockPriceDto.start, calcStockPriceDto.end),
      },
      order: {
        timestamp: 'ASC',
      },
    });
    if (stockPrices.length === 0) return null;

    const budget = calcStockPriceDto.budget
      ? calcStockPriceDto.budget
      : Infinity;
    let maxProfit = 0;
    let minBuy = Infinity;
    let minBuytime = 0;
    let buytime = 0;
    let selltime = 0;
    for (let i = 0; i < stockPrices.length; i++) {
      const price = stockPrices[i].price;
      if (price < minBuy && price <= budget) {
        minBuy = price;
        minBuytime = i;
      } else {
        const profit = price - minBuy;
        if (profit > maxProfit) {
          maxProfit = profit;
          buytime = minBuytime;
          selltime = i;
        }
      }
    }
    return {
      buy: stockPrices[buytime],
      sell: stockPrices[selltime],
      profit: maxProfit,
    };
  }
}

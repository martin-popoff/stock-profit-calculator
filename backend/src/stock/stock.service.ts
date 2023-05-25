import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { StockDto, FindStockDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  test(dto: StockDto) {
    return dto;
  }

  async find(findStockDto: FindStockDto): Promise<Stock[]> {
    const take = findStockDto.limit;
    const skip = findStockDto.offset * findStockDto.limit;
    return await this.stockRepository.find({
      take,
      skip,
    });
    return await this.stockRepository.find();
  }

  async findOne(id: number): Promise<Stock> {
    return await this.stockRepository.findOneBy({ id: id });
  }

  async create(createStockDto: StockDto): Promise<Stock> {
    const stock = new Stock();
    stock.name = createStockDto.name;
    stock.symbol = createStockDto.symbol;

    const createdStock = await this.stockRepository.save(stock);
    return createdStock;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.stockRepository.delete(id);
  }

  faker(limit: number) {
    for (let i = 0; i < limit; i++) {
      const newStock = new Stock();
      this.stockRepository.save(newStock);
    }
  }
}

import { Transform } from 'class-transformer';
import { IsDecimal, IsNotEmpty, Max } from 'class-validator';

export class MockStockPriceDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  ammount: number;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  start: number;
}

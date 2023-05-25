import { Transform } from 'class-transformer';
import { IsDecimal, IsNotEmpty, Max } from 'class-validator';

export class StockPriceDto {
  @Transform(({ value }) => parseInt(value))
  @Max(Math.round(Date.now() / 1000))
  @IsNotEmpty()
  timestamp: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  price: number;
}

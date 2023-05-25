import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FindStockPriceDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  readonly limit: number = 100;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  readonly offset: number = 0;
}

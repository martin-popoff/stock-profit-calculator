import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FindStockDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  readonly limit: number = 10;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  readonly offset: number = 0;
}

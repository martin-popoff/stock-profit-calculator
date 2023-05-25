import {
  IsDecimal,
  IsInt,
  IsOptional,
  Min,
  Validate,
} from '@nestjs/class-validator';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Max } from 'class-validator';
import { CompareTimestamps } from './TimestampCompare';

export class CalcStockPriceDto {
  @Transform(({ value }) => parseInt(value))
  @Max(Math.round(Date.now() / 1000), {
    message: 'The start date cannot be in the future',
  })
  @IsNotEmpty()
  readonly start: number;

  @Transform(({ value }) => parseInt(value))
  @Max(Math.round(Date.now() / 1000), {
    message: 'The end date cannot be in the future',
  })
  @IsNotEmpty()
  @Validate(CompareTimestamps, ['start'], {
    message: 'The start date must be before the end date',
  })
  readonly end: number;

  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  @IsOptional()
  readonly budget: number;
}

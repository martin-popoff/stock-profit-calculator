import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { StockPrice } from '../price/entities/stockPrice.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  symbol: string;

  @OneToMany(() => StockPrice, (stockPrice) => stockPrice.price)
  stockPrices: StockPrice[];
}

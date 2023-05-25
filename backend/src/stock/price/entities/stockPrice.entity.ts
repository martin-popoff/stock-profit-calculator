import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm';
import { Stock } from '../../entities/stock.entity';

@Entity()
@Unique(['stock', 'timestamp'])
export class StockPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('stock-idx')
  @ManyToOne(() => Stock, (stock) => stock.id)
  stock: Stock;

  @Index('time-idx')
  @Column()
  timestamp: number;

  @Index('price-idx')
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}

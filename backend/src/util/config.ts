import { Stock } from '../stock/entities/stock.entity';
import { StockPrice } from '../stock/price/entities/stockPrice.entity';

export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    type: process.env.DATABASE_TYPE,
    name: process.env.DATABASE_NAME,
    database: process.env.DATABASE_DB,
    entities: [Stock, StockPrice],
    synchronize: true,
  },
});

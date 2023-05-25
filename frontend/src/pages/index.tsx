/* eslint-disable @next/next/no-img-element */
import DateTime from "@/components/DateTime";
import Pick from "@/components/Pick";
import Step from "@/components/Step";
import axios, { AxiosError } from "axios";
import { Key, useEffect, useState } from "react";
import { Item } from "react-stately";
import { CalendarDateTime, getLocalTimeZone } from "@internationalized/date";

export interface Stock {
  id: number;
  name: string;
  symbol: string;
}

interface StockPrice {
  id: number;
  price: number;
  timestamp: number;
}

interface Solution {
  buy: StockPrice;
  sell: StockPrice;
  profit: number;
}

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  const [selectedStock, setSelectedStock] = useState<Stock>();
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
  const [budget, setBudget] = useState<number>();
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStocks = async () => {
    const res = await axios.get<Stock[]>("http://localhost:3017/stock");
    return res.data;
  };

  const calculateProfit = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    if (!selectedStock)
      return setError("Please select a stock from the dropdown menu (Step 1)");
    if (!startDate)
      return setError("Please select a valid start date (Step 2)");
    if (!endDate) return setError("Please select a valid end date (Step 3)");
    try {
      const res = await axios
        .get<Solution>(
          `http://localhost:3017/stock/${
            selectedStock.id
          }/price/calc?start=${startDate}&end=${endDate}${
            budget ? `&budget=${budget}` : ""
          }`
        )
        .then((res) => res.data);
      setLoading(false);
      if (res.profit == 0) {
        return setMessage(
          `You couldn't have many any profit in the specified time window ${
            budget ? "and the specified budget" : ""
          }.`
        );
      }
      return setMessage(
        `The maximum profit you could've earned would be $${res.profit.toFixed(
          2
        )}. You could've achieved it buy buying '${
          selectedStock.name
        }' for $${res.buy.price.toFixed(2)} @ ${new Date(
          res.buy.timestamp
        )} and selling for $${res.sell.price.toFixed(2)} @ ${new Date(
          res.sell.timestamp
        )}`
      );
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      if (err.response && err.response.data.statusCode === 404)
        setMessage(
          `No price data found for stock '${selectedStock.name}' within the specified time window.`
        );
      else if (err.response) {
        setError(err.response.data.message[0]);
      }
    }
  };

  useEffect(() => {
    fetchStocks()
      .then((res) => setStocks(res))
      .catch((e) => console.error(e));
  }, []);

  const changeSelectedStock = (key: Key) => {
    const stock = stocks.find((stock) => stock.id == key);
    if (stock) setSelectedStock(stock);
  };

  const changeStartDate = (date: CalendarDateTime) => {
    if (date)
      setStartDate(
        Math.floor(date.toDate(getLocalTimeZone()).getTime() / 1000)
      );
    else setStartDate(null);
  };

  const changeEndDate = (date: CalendarDateTime) => {
    if (date)
      setEndDate(Math.floor(date.toDate(getLocalTimeZone()).getTime() / 1000));
    else setEndDate(null);
  };

  const changeBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(parseFloat(e.target.value));
  };

  return (
    <main className="container py-24">
      <div className="absolute right-12 top-12 -z-10 max-w-[600px] scale-50 opacity-30 md:scale-75 lg:right-32 lg:top-32 lg:scale-100 lg:opacity-100">
        <span className="absolute -z-10 h-80 w-80 animate-pulse rounded-full bg-cyan-700 opacity-60 blur-3xl" />
        <span className="absolute -z-10 -ml-24 mt-48 h-80 w-80 animate-pulse rounded-full bg-pink-700  opacity-60 blur-3xl" />
        <span className="absolute -z-10 ml-24 mt-24 h-80 w-80 animate-pulse rounded-full bg-purple-800 opacity-60 blur-3xl" />
        <img
          src="/stocks.png"
          alt="Picture of abstract figures"
          className="mt-12 max-h-[400px] -translate-x-12"
        />
      </div>
      <section className="mb-24">
        <div>
          <h1 className="mb-4 inline-block border-b-2 border-neutral-600 pb-4 text-4xl font-bold">
            Stock calculator
          </h1>
          <h2 className="max-w-md text-xl text-neutral-200">
            Choose a stock, a time window and your available budget, to
            calculate what would have been the best times to buy and sell for
            maxmium profit.
          </h2>
          <h3 className="mt-2 text-neutral-500">Martin Popov for LucidLink</h3>
        </div>
      </section>
      <section className="">
        <div className="flex items-center gap-8">
          <Step step="1"></Step>
          <h2 className="text-xl font-semibold">Choose your stock</h2>
        </div>
        <div className="my-4 ml-8 border-l-2 border-dashed border-neutral-500 py-12 pl-16">
          <Pick label="Stock" onSelectionChange={changeSelectedStock}>
            {stocks.map((stock) => (
              <Item key={stock.id}>{`${stock.name} (${stock.symbol})`}</Item>
            ))}
          </Pick>
        </div>
      </section>
      <section className="">
        <div className="flex items-center gap-8">
          <Step step="2"></Step>
          <h2 className="text-xl font-semibold">Choose a time period</h2>
        </div>
        <div className="my-4 ml-8 flex flex-col flex-wrap gap-12 border-l-2 border-dashed border-neutral-500 py-12 pl-16 lg:flex-row lg:items-center">
          <DateTime
            label="Start period"
            granularity="second"
            hourCycle={24}
            onChange={changeStartDate}
          />
          <p
            className={`-mt-12 w-full text-red-400 ${
              !startDate || !endDate || startDate < endDate ? "invisible" : ""
            }`}
          >
            Start date must be before end date
          </p>
          <DateTime
            label="End period"
            granularity="second"
            hourCycle={24}
            onChange={changeEndDate}
          />
        </div>
      </section>
      <section className="">
        <div className="flex items-center gap-8">
          <Step step="3"></Step>
          <h2 className="text-xl font-semibold">
            Choose your budget <span className="font-normal">(optional)</span>
          </h2>
        </div>
        <div className="my-4 ml-8 flex items-center gap-12 border-l-2 border-dashed border-neutral-500 py-12 pl-16">
          <input
            type="number"
            onChange={changeBudget}
            step="0.01"
            className="w-80 border-2 border-neutral-500 bg-neutral-900 px-4 py-3 text-lg outline-none transition-colors focus:border-neutral-100"
          />
        </div>
      </section>
      <section>
        <div className="flex items-center gap-8">
          <Step step="4"></Step>
          <h2 className="text-xl font-semibold">
            Calculate your maximum profit
          </h2>
        </div>
        <div className="my-4 ml-8 border-l-2 border-dashed border-neutral-500 py-12 pl-16">
          <button
            className="group relative w-80 overflow-hidden p-1 text-lg font-semibold transition-colors disabled:bg-neutral-800 disabled:text-neutral-500"
            disabled={
              (selectedStock && startDate && endDate && startDate < endDate) ||
              loading
                ? false
                : true
            }
            onClick={calculateProfit}
          >
            <span className="absolute -top-2 left-0 -z-10 h-12 w-60 rounded-full bg-cyan-700 opacity-60 blur-md" />
            <span className="absolute -left-4  top-8 -z-10 h-12 w-40 rounded-full bg-pink-700  opacity-60 blur-md" />
            <span className="absolute -right-4 top-2 -z-10 h-12 w-60 rounded-full bg-purple-800 opacity-60 blur-md" />
            <p className="bg-neutral-900 px-4 py-3 transition-colors group-hover:bg-neutral-800 group-disabled:hover:bg-neutral-900">
              Calculate
            </p>
          </button>
        </div>
      </section>
      <section>
        <div className="flex items-center gap-8 ">
          <Step step="5"></Step>
          <h2 className="text-xl font-semibold">Results</h2>
        </div>

        <div
          className={`my-4 ml-8 border-b-2 border-l-2 border-dashed border-neutral-500 py-12 pl-16 ${
            error || message ? "visible" : "invisible"
          }`}
        >
          <p className={`h-4 text-red-400 ${error ? "" : "invisible"}`}>
            {error}
          </p>
          <p className={` ${message ? "" : "invisible"}`}>{message}</p>
        </div>
      </section>
      <div className="h-20"></div>
    </main>
  );
}

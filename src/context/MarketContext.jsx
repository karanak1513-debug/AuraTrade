import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStocks } from '../utils/seedData';

const MarketContext = createContext();

export function useMarket() {
  return useContext(MarketContext);
}

export function MarketProvider({ children }) {
  const [stocks, setStocks] = useState(initialStocks);

  useEffect(() => {
    const simulateMarket = () => {
      setStocks(prevStocks => prevStocks.map(stock => {
        // Random change between -0.5% and +0.5% every few seconds
        const volatility = 0.005;
        const changePercent = (Math.random() - 0.5) * volatility;
        const newPrice = stock.price * (1 + changePercent);
        const dayChange = newPrice - (stock.price / (1 + stock.change / 100)); // Rough estimate
        const dayChangePercent = (dayChange / (newPrice - dayChange)) * 100;

        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(dayChangePercent.toFixed(2))
        };
      }));
    };

    const interval = setInterval(simulateMarket, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getStock = (symbol) => stocks.find(s => s.symbol === symbol);

  return (
    <MarketContext.Provider value={{ stocks, getStock }}>
      {children}
    </MarketContext.Provider>
  );
}

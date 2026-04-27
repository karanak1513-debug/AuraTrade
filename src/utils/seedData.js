export const initialStocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.45, sector: 'Energy', change: 1.2 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4120.10, sector: 'IT', change: -0.5 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1530.25, sector: 'Banking', change: 0.8 },
  { symbol: 'INFY', name: 'Infosys', price: 1610.80, sector: 'IT', change: 1.5 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1090.40, sector: 'Banking', change: -0.2 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1210.15, sector: 'Telecom', change: 2.1 },
  { symbol: 'SBI', name: 'State Bank of India', price: 770.60, sector: 'Banking', change: 0.5 },
  { symbol: 'LICI', name: 'LIC India', price: 920.30, sector: 'Insurance', change: -1.1 },
  { symbol: 'ITC', name: 'ITC Limited', price: 440.75, sector: 'FMCG', change: 0.3 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2380.90, sector: 'FMCG', change: -0.7 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3120.50, sector: 'Conglomerate', change: 3.4 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6540.20, sector: 'NBFC', change: -1.5 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 12100.00, sector: 'Automobile', change: 0.6 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: 1540.30, sector: 'Healthcare', change: 1.8 },
  { symbol: 'TITAN', name: 'Titan Company', price: 3620.45, sector: 'Consumer Goods', change: -0.4 },
  { symbol: 'AXISBANK', name: 'Axis Bank', price: 1050.80, sector: 'Banking', change: 0.9 },
  { symbol: 'WIPRO', name: 'Wipro', price: 480.20, sector: 'IT', change: -2.3 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', price: 9850.60, sector: 'Construction', change: 0.2 },
  { symbol: 'ONGC', name: 'ONGC', price: 275.40, sector: 'Energy', change: 1.4 },
  { symbol: 'NTPC', name: 'NTPC', price: 345.20, sector: 'Energy', change: 0.7 }
];

export const learningModules = [
  {
    id: 1,
    title: 'Stock Market Basics',
    lesson: 'The stock market is a marketplace where shares of publicly held companies are issued and traded. It plays a vital role in the economy by providing companies with access to capital and investors with an opportunity to share in the profits of these companies.',
    keyPoints: ['Companies sell shares to raise money', 'Investors buy shares to own a part of the company', 'Prices are driven by supply and demand'],
    example: 'If you buy 10 shares of Reliance at ₹2900, you are a part-owner of the company.'
  },
  {
    id: 2,
    title: 'Bull vs Bear Market',
    lesson: 'A bull market occurs when stock prices are on the rise and the public is optimistic. A bear market is the opposite, characterized by falling prices and widespread pessimism.',
    keyPoints: ['Bull = Upward trend', 'Bear = Downward trend', 'Influenced by GDP, interest rates, and corporate profits'],
    example: 'The "Big Bull" Harshad Mehta era was a famous bull run in India.'
  },
  {
    id: 3,
    title: 'Risk Management',
    lesson: 'Risk management is the process of identifying, analyzing, and accepting or mitigating uncertainty in investment decisions. It is the most critical skill for a long-term trader.',
    keyPoints: ['Never risk more than 2% on a single trade', 'Use Stop Losses', 'Understand your risk-reward ratio'],
    example: 'If your capital is ₹1,00,000, your max loss per trade should be ₹2,000.'
  }
];

export const quizQuestions = [
  {
    id: 1,
    topic: 'Market Basics',
    difficulty: 'Easy',
    question: 'What does IPO stand for?',
    options: ['Initial Public Offering', 'Internal Profit Operation', 'Investment Price Option', 'International Public Order'],
    correctAnswerIndex: 0,
    explanation: 'An Initial Public Offering (IPO) is the first time a company offers its shares to the general public.'
  },
  {
    id: 2,
    topic: 'Trading',
    difficulty: 'Easy',
    question: 'What is a Stop Loss?',
    options: ['An order to buy at higher price', 'An order to limit potential loss on a trade', 'A way to stop the market', 'A tax-saving strategy'],
    correctAnswerIndex: 1,
    explanation: 'A stop-loss order is designed to limit an investor\'s loss on a security position.'
  },
  {
    id: 3,
    topic: 'Investing',
    difficulty: 'Medium',
    question: 'What is Diversification?',
    options: ['Buying only one stock', 'Investing in different industries and assets', 'Selling all shares', 'Buying stocks on margin'],
    correctAnswerIndex: 1,
    explanation: 'Diversification is the practice of spreading your investments around so that your exposure to any one type of asset is limited.'
  },
  {
    id: 4,
    topic: 'Markets',
    difficulty: 'Easy',
    question: 'Which of these is a major Indian stock exchange?',
    options: ['NYSE', 'NASDAQ', 'NSE', 'FTSE'],
    correctAnswerIndex: 2,
    explanation: 'The National Stock Exchange (NSE) is the leading stock exchange of India.'
  },
  {
    id: 5,
    topic: 'Analysis',
    difficulty: 'Medium',
    question: 'What does P/E Ratio stand for?',
    options: ['Price-to-Earnings', 'Profit-to-Equity', 'Price-to-Entry', 'Profit-to-Efficiency'],
    correctAnswerIndex: 0,
    explanation: 'The P/E ratio is the ratio for valuing a company that measures its current share price relative to its per-share earnings.'
  },
  {
    id: 6,
    topic: 'Trading',
    difficulty: 'Easy',
    question: 'What is a "Bull Market"?',
    options: ['Prices are falling', 'Prices are rising', 'Prices are stable', 'Market is closed'],
    correctAnswerIndex: 1,
    explanation: 'A bull market is a market that is on the rise and where the economy is sound.'
  },
  {
    id: 7,
    topic: 'Trading',
    difficulty: 'Easy',
    question: 'What is a "Bear Market"?',
    options: ['Prices are rising', 'Prices are falling', 'Prices are stable', 'Market is at an all-time high'],
    correctAnswerIndex: 1,
    explanation: 'A bear market is when a market experiences prolonged price declines.'
  },
  {
    id: 8,
    topic: 'Dividends',
    difficulty: 'Medium',
    question: 'What are Dividends?',
    options: ['A type of tax', 'Regular payments of profit to shareholders', 'Money lost in a trade', 'Fees paid to brokers'],
    correctAnswerIndex: 1,
    explanation: 'Dividends are payments made by a corporation to its shareholder members.'
  },
  {
    id: 9,
    topic: 'Regulation',
    difficulty: 'Easy',
    question: 'Who regulates the Indian stock market?',
    options: ['RBI', 'SEBI', 'IRDAI', 'NITI Aayog'],
    correctAnswerIndex: 1,
    explanation: 'SEBI (Securities and Exchange Board of India) is the regulatory body for securities and commodity market in India.'
  },
  {
    id: 10,
    topic: 'Market Terms',
    difficulty: 'Medium',
    question: 'What is "Market Capitalization"?',
    options: ['Total profit of a company', 'Total value of all outstanding shares', 'The physical size of the stock exchange', 'The amount of cash a company has'],
    correctAnswerIndex: 1,
    explanation: 'Market cap is the total market value of a company\'s outstanding shares of stock.'
  },
  {
    id: 11,
    topic: 'Investing',
    difficulty: 'Hard',
    question: 'What is Compound Interest often called?',
    options: ['The 8th wonder of the world', 'The first rule of trading', 'A risky gamble', 'Broker\'s commission'],
    correctAnswerIndex: 0,
    explanation: 'Albert Einstein reportedly called compound interest the "eighth wonder of the world."'
  },
  {
    id: 12,
    topic: 'Sectors',
    difficulty: 'Medium',
    question: 'NIFTY IT index tracks which companies?',
    options: ['Banks', 'Tech and Software companies', 'Automobile firms', 'Pharma companies'],
    correctAnswerIndex: 1,
    explanation: 'NIFTY IT index is designed to reflect the performance of the Indian IT Companies.'
  },
  {
    id: 13,
    topic: 'Valuation',
    difficulty: 'Hard',
    question: 'Which of the following is a type of fundamental analysis?',
    options: ['RSI', 'MACD', 'Cash Flow Analysis', 'Moving Averages'],
    correctAnswerIndex: 2,
    explanation: 'Fundamental analysis involves analyzing a company\'s financial statements, like cash flow, to determine its fair value.'
  },
  {
    id: 14,
    topic: 'Trading',
    difficulty: 'Easy',
    question: 'What is a "Day Trader"?',
    options: ['Someone who buys and holds for years', 'Someone who buys and sells within the same day', 'Someone who only trades on Mondays', 'A bank employee'],
    correctAnswerIndex: 1,
    explanation: 'Day trading is the act of buying and selling a financial instrument within the same day.'
  },
  {
    id: 15,
    topic: 'Indices',
    difficulty: 'Easy',
    question: 'SENSEX is the index of which stock exchange?',
    options: ['NSE', 'BSE', 'MCX', 'NCDEX'],
    correctAnswerIndex: 1,
    explanation: 'SENSEX is the benchmark index of the Bombay Stock Exchange (BSE).'
  },
  {
    id: 16,
    topic: 'Markets',
    difficulty: 'Easy',
    question: 'What is "Volume" in trading?',
    options: ['The loudness of the floor', 'The number of shares traded', 'The size of the company', 'The stock price'],
    correctAnswerIndex: 1,
    explanation: 'Volume is the number of shares or contracts traded in a security or an entire market during a given period of time.'
  },
  {
    id: 17,
    topic: 'Analysis',
    difficulty: 'Hard',
    question: 'What does EBITDA stand for?',
    options: ['Earnings Before Interest, Taxes, Depreciation, and Amortization', 'Equity Balance in Trading and Asset Management', 'Efficient Budgeting in Total Asset Development', 'Earnings Before Investing and Trading All Asset'],
    correctAnswerIndex: 0,
    explanation: 'EBITDA is a measure of a company\'s overall financial performance.'
  },
  {
    id: 18,
    topic: 'Trading',
    difficulty: 'Medium',
    question: 'What is "Short Selling"?',
    options: ['Buying low and selling high', 'Selling a security you dont own to buy back cheaper', 'Selling shares very quickly', 'Trading only on short days'],
    correctAnswerIndex: 1,
    explanation: 'Short selling is an investment or speculative strategy that speculates on a decline in a security\'s price.'
  },
  {
    id: 19,
    topic: 'Markets',
    difficulty: 'Easy',
    question: 'What is a "Blue Chip" stock?',
    options: ['A stock of a new company', 'A stock of a reputable, stable, and financially sound company', 'A stock that is very cheap', 'A stock used for gambling'],
    correctAnswerIndex: 1,
    explanation: 'Blue-chip stocks are shares of very large and well-recognized companies with a long history of sound financial performance.'
  },
  {
    id: 20,
    topic: 'Regulation',
    difficulty: 'Medium',
    question: 'What is "Insider Trading"?',
    options: ['Trading within the stock exchange building', 'Illegal trading based on non-public material information', 'Trading by office employees only', 'Trading during lunch breaks'],
    correctAnswerIndex: 1,
    explanation: 'Insider trading is the trading of a public company\'s stock or other securities based on material, nonpublic information about the company.'
  },
  {
    id: 21,
    topic: 'Strategy',
    difficulty: 'Easy',
    question: 'What is "HODL" in investment slang?',
    options: ['Sell immediately', 'Buy more always', 'Hold On for Dear Life', 'High Only During Lunch'],
    correctAnswerIndex: 2,
    explanation: 'HODL is a term used in the crypto and stock community for holding onto an asset rather than selling it.'
  },
  {
    id: 22,
    topic: 'Analysis',
    difficulty: 'Medium',
    question: 'What is a "Dividend Yield"?',
    options: ['The total profit of the company', 'The dividend per share divided by stock price', 'The speed at which dividends grow', 'The tax paid on dividends'],
    correctAnswerIndex: 1,
    explanation: 'Dividend yield is a financial ratio that shows how much a company pays out in dividends each year relative to its stock price.'
  },
  {
    id: 23,
    topic: 'Trading',
    difficulty: 'Easy',
    question: 'What is a "Market Order"?',
    options: ['Buying at a specific future price', 'Buying immediately at the current best available price', 'Waiting for the market to close', 'Ordering coffee at the market'],
    correctAnswerIndex: 1,
    explanation: 'A market order is an instruction to buy or sell a security immediately at the current price.'
  },
  {
    id: 24,
    topic: 'Investing',
    difficulty: 'Medium',
    question: 'What is "Asset Allocation"?',
    options: ['Selling all assets', 'Dividing an investment portfolio among different asset categories', 'Buying a new house', 'Giving money to charity'],
    correctAnswerIndex: 1,
    explanation: 'Asset allocation is an investment strategy that aims to balance risk and reward by apportioning a portfolio\'s assets according to an individual\'s goals.'
  },
  {
    id: 25,
    topic: 'Risk',
    difficulty: 'Hard',
    question: 'What is "Beta" in stock analysis?',
    options: ['A measure of stock liquidity', 'A measure of a stocks volatility relative to the overall market', 'The profit margin of a company', 'The second letter of the alphabet'],
    correctAnswerIndex: 1,
    explanation: 'Beta is a measure of the volatility—or systematic risk—of a security or portfolio compared to the market as a whole.'
  }
];

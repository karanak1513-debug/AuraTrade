const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function test() {
  console.log("Testing Binance...");
  try {
    const binApi = await fetchUrl('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=5');
    console.log("Binance:", binApi.status, binApi.data.substring(0, 50));
  } catch(e) {
    console.log("Binance err:", e);
  }

  console.log("Testing Yahoo via AllOrigins...");
  try {
    const yfUrl = encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/RELIANCE.NS?interval=1d&range=5d');
    const allOrigins = await fetchUrl('https://api.allorigins.win/raw?url=' + yfUrl);
    console.log("AllOrigins:", allOrigins.status, allOrigins.data.substring(0, 100));
  } catch(e) {
    console.log("AllOrigins err:", e);
  }
}

test();

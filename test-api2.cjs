const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      resolve(res.headers);
    }).on('error', reject);
  });
}

async function test() {
  const headers = await fetchUrl('https://query1.finance.yahoo.com/v8/finance/chart/RELIANCE.NS?interval=1d&range=5d');
  console.log("CORS headers:", headers['access-control-allow-origin']);
}

test();

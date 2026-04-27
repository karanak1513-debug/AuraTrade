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
  const yfUrl = encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/RELIANCE.NS?interval=1d&range=5d');
  
  try {
    const corsProxyIo = await fetchUrl('https://corsproxy.io/?' + yfUrl);
    console.log("corsproxy.io:", corsProxyIo.status);
  } catch(e) { console.log("corsproxy error"); }

  try {
    const codeTabs = await fetchUrl('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/RELIANCE.NS?interval=1d&range=5d'));
    console.log("codetabs:", codeTabs.status);
  } catch(e) { console.log("codetabs error"); }
}

test();

const fetch = require("node-fetch");

const url =
  "https://api.coingecko.com/api/v3/coins/top_gainers_losers?vs_currency=usd";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-api-key": "CG-2dpqtLrtQnVqDXyop5NfJ1mU",
  },
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));

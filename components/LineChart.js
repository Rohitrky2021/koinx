"use client";

import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

const LineChart = ({ coins }) => {
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [trendingCoins, setCoins] = useState([]);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/search/trending",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-cg-demo-api-key": "CG-2dpqtLrtQnVqDXyop5NfJ1mU",
            },
          }
        );

        const data = await response.json();

        // console.log(data);

        setCoins(data.coins || []);
      } catch (error) {
        console.error("Error fetching trending coins:", error);
      }
    };

    fetchTrendingCoins();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!coins || coins.length === 0) return;

      const fetchCoinData = async (coin) => {
        const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart/range?vs_currency=usd&from=1721208694&to=1721295094`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": "CG-2dpqtLrtQnVqDXyop5NfJ1mU",
          },
        };

        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const json = await response.json();
          return json.prices.map((entry) => ({
            x: new Date(entry[0]),
            y: entry[1],
          }));
        } catch (error) {
          console.error(`Fetch error for ${coin}:`, error);
          return [];
        }
      };

      const coinsArray = coins.split(",");

      const dataPromises = coinsArray.map(fetchCoinData);
      const allData = await Promise.all(dataPromises);

      // Combine data for each coin into a single dataset
      const formattedData = coinsArray.map((coin, index) => ({
        label: `${coin} Price (USD)`,
        data: allData[index],
        borderColor:
          index === 2
            ? "rgba(982, 23, 235, 1)"
            : index % 2 === 0
            ? "rgba(54, 162, 235, 1)"
            : "rgba(255, 99, 132, 1)",
        backgroundColor:
          index === 2
            ? "rgba(982, 23, 235, 0.2)"
            : index % 2 === 0
            ? "rgba(54, 162, 235, 0.2)"
            : "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: true,
      }));

      setChartData(formattedData);
    };

    fetchData();
  }, [coins]);

  useEffect(() => {
    if (chartRef.current && chartData.length > 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(54, 162, 235, 0.2)");
      gradient.addColorStop(1, "rgba(54, 162, 235, 0)");

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          datasets: chartData,
        },
        options: {
          animation: {
            duration: 2000,
            easing: "easeInOutBounce",
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "hour",
                tooltipFormat: "HH:mm",
                displayFormats: {
                  hour: "HH:mm",
                },
              },
              title: {
                display: true,
                text: "Time",
              },
              ticks: {
                callback: (value) => {
                  const date = new Date(value);
                  return `${date.getHours()}:00`;
                },
              },
            },
            y: {
              title: {
                display: true,
                text: "Price (USD)",
              },
            },
          },
        },
      });
    }
  }, [chartData]);

  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist);
  const recentlyViewed = [...watchlist];

  const createList = (items) => {
    return (
      <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 px-4 text-left text-gray-700">Name</th>
            {/* <th className="py-2 px-4 text-left text-gray-700">Symbol</th> */}
            <th className="py-2 px-4 text-left text-gray-700">Price (USD)</th>
            <th className="py-2 px-4 text-left text-gray-700">24h Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-b border-gray-200">
              <td className="py-2 px-4 flex items-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-6 h-6 mr-2"
                  width={100}
                  height={100}
                />
                {item.name}
              </td>
              {/* <td className="py-2 px-4">{item.symbol}</td> */}
              <td className="py-2 px-4">
                $
                {item.current_price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td
                className={`py-2 px-4 text-${
                  item.ath_change_percentage > 0 ? "green" : "red"
                }-600`}
              >
                {item.ath_change_percentage.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen">
      <div className="container mx-auto mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 fade-in">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-lg">
          <canvas ref={chartRef} className="line-chart"></canvas>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-600">Watchlist</h2>
            <div id="watchlist" className="text-black space-y-2">
              {createList(watchlist)}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              Recently Viewed
            </h2>
            <div id="recentlyViewed" className="text-black space-y-2">
              {createList(recentlyViewed)}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg fade-in">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          Trending Market
        </h2>
        <div className="container mx-auto p-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 px-4 text-left text-gray-700">Name</th>
                <th className="py-2 px-4 text-left text-gray-700">Symbol</th>
                <th className="py-2 px-4 text-left text-gray-700">
                  Price (USD)
                </th>
                <th className="py-2 px-4 text-left text-gray-700">
                  24h Change (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {trendingCoins.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-200">
                  <td className="py-2 px-4 flex flex-row">
                    <Image
                      src={coin.item.small}
                      alt={coin.item.name}
                      className="w-6 h-6 mr-2"
                      width={100}
                      height={100}
                    />
                    {coin.item.name}
                  </td>
                  <td className="py-2 px-4">{coin.item.symbol}</td>
                  <td className="py-2 px-4 ">
                    $
                    {coin.item.data.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-4 text-green-500">
                    {coin.item.data.price_change_percentage_24h.usd.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LineChart;

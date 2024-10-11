"use client";
import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../../components/navbar";
import { addToWatchlist } from "../../../redux/slices/watchlistSlice";
import Link from "next/link";

const CoinPage = ({ params }) => {
  const [chartData, setChartData] = useState(null);
  const [coinDetails, setCoinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setLoading(true); // Start loading

        const chartResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${params.coinId}/market_chart/range?vs_currency=usd&from=1721208694&to=1721295094`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-cg-demo-api-key": "CG-2dpqtLrtQnVqDXyop5NfJ1mU",
            },
          }
        );
        const detailsResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${params.coinId}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-cg-demo-api-key": "CG-2dpqtLrtQnVqDXyop5NfJ1mU",
            },
          }
        );

        if (!chartResponse.ok || !detailsResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const chartDataJson = await chartResponse.json();
        const detailsDataJson = await detailsResponse.json();

        const formattedChartData = chartDataJson.prices.map((entry) => ({
          x: new Date(entry[0]),
          y: entry[1],
        }));
        setChartData(formattedChartData);
        setCoinDetails(detailsDataJson);

        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false); // Stop loading on error
      }
    };

    fetchCoinData();
  }, [params.coinId]);

  useEffect(() => {
    if (chartRef && chartRef.current && chartData) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(255, 99, 132, 0.2)");
      gradient.addColorStop(1, "rgba(255, 99, 132, 0)");

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: params.coinId.toUpperCase(),
              data: chartData,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: gradient,
              tension: 0.4,
              fill: true,
            },
          ],
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
              },
              title: {
                display: true,
                text: "Time",
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

  const createList = (items) => {
    return items.map((item) => (
      <div
        key={item.name}
        className="flex justify-between p-2 bg-gray-100 rounded-lg shadow-sm"
      >
        <div className="flex items-center">
          <Image
            src={item.image}
            alt={item.name}
            className="w-6 h-6 mr-2"
            width={100}
            height={100}
          />
          {item.name}
        </div>
        <span className="text-gray-600">
          {item.current_price?.toLocaleString() ?? "N/A"}
        </span>
        <span
          className={`text-${
            item.ath_change_percentage > 0 ? "green" : "red"
          }-600`}
        >
          {item.ath?.toLocaleString() ?? "N/A"}
        </span>
        <span className="text-gray-600">
          {item.market_cap?.toLocaleString() ?? "N/A"}
        </span>
      </div>
    ));
  };
let x="explorer"
  const calculatePercentage = (value, maxValue) => {
    if (!maxValue || maxValue <= 0) return 0;
    return (value / maxValue) * 100;
  };

  const todayLowPercentage = coinDetails?.market_data?.low_24h?.usd
    ? calculatePercentage(
        coinDetails.market_data.low_24h.usd,
        coinDetails.market_data.high_24h?.usd
      )
    : 0;

  const todayHighPercentage = coinDetails?.market_data?.high_24h?.usd
    ? calculatePercentage(
        coinDetails.market_data.high_24h.usd,
        coinDetails.market_data.high_24h?.usd
      )
    : 0;

  const weekLowPercentage = coinDetails?.market_data?.low_24h?.usd
    ? calculatePercentage(
        coinDetails.market_data.low_24h.usd,
        coinDetails.market_data.high_24h?.usd
      )
    : 0;

  const weekHighPercentage = coinDetails?.market_data?.high_24h?.usd
    ? calculatePercentage(
        coinDetails.market_data.high_24h.usd,
        coinDetails.market_data.high_24h?.usd
      )
    : 0;

  const handleAddToWatchlist = () => {
    if (coinDetails) {
      dispatch(addToWatchlist(coinDetails));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="loader"> </div>
          </div>
        ) : (
          <div className="container mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                {coinDetails && (
                  <div>
                    <h1 className="text-2xl font-bold">
                      {coinDetails.name} ({coinDetails.symbol.toUpperCase()})
                    </h1>
                    <p className="text-3xl font-semibold text-green-600">
                      $
                      {coinDetails.market_data?.current_price?.usd?.toLocaleString() ??
                        "N/A"}{" "}
                      <span className="text-green-500 text-lg">
                        (
                        {coinDetails.market_data?.price_change_percentage_24h?.toFixed(
                          2
                        ) ?? "N/A"}
                        %)
                      </span>
                    </p>
                  </div>
                )}
                <div className="text-right">
                  {/* <button
                    onClick={handleAddToWatchlist}
                    className="bg-green-500 text-white p-2 rounded-full"
                  >
                    +
                  </button> */}
                </div>
              </div>
              <canvas ref={chartRef} className="line-chart" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4 text-green-600">
                  Watchlist
                </h2>
                <div id="watchlist" className="space-y-2">
                  {createList(watchlist)}
                </div>
                <div className="text-right">
                 
                  <Link href={`/${x}`} className="text-blue-600"> View more coinss</Link>
                </div>
              </div>
              <div> 
                <h2 className="text-xl font-bold mb-4 text-green-600">
                  Recently Viewed
                </h2>
                <div id="recentlyViewed" className="space-y-2">
                  {createList(watchlist)}
                </div>
                <div className="text-right">
                <Link href={`/${x}`} className="text-blue-600"> View more coinss</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {coinDetails && (
          <>
            <div className="container mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg fade-in space-y-4">
              <h2 className="text-xl font-bold mb-4 text-green-600">
                Performance
              </h2>
              <div className="flex justify-between items-center">
                <span>
                  Todays Low: $
                  {coinDetails.market_data?.low_24h?.usd?.toFixed(2) ?? "N/A"}
                </span>
                <div className="w-full mx-4 h-2 bg-gray-300 rounded-lg">
                  <div
                    className="h-full bg-green-600 rounded-lg"
                    style={{ width: `${todayLowPercentage}%` }}
                  ></div>
                </div>
                <span>
                  Todays High: $
                  {coinDetails.market_data?.high_24h?.usd?.toFixed(2) ?? "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>
                  This Week Low: $
                  {coinDetails.market_data?.low_24h?.usd?.toFixed(2) ?? "N/A"}
                </span>
                <div className="w-full mx-4 h-2 bg-gray-300 rounded-lg">
                  <div
                    className="h-full bg-green-600 rounded-lg"
                    style={{ width: `${weekLowPercentage}%` }}
                  ></div>
                </div>
                <span>
                  This Week High: $
                  {coinDetails.market_data?.high_24h?.usd?.toFixed(2) ?? "N/A"}
                </span>
              </div>
            </div>

            <div className="container mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg fade-in space-y-4">
              <h2 className="text-xl font-bold mb-4 text-green-600">About</h2>
              <div
                dangerouslySetInnerHTML={{ __html: coinDetails.description.en }}
              ></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoinPage;

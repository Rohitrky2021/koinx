"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { fetchCoins } from "../redux/slices/coinSlice";
import { addToWatchlist, removeFromWatchlist } from "../redux/slices/watchlistSlice";
import Link from "next/link";
import "./../app/(routes)/[coinId]/style.css"

const CryptoDashboard = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins);
  const watchlist = useSelector((state) => state.watchlist);

  const [currency, setCurrency] = useState("usd");
  const [sortBy, setSortBy] = useState("market_cap_desc");
  const [coinSearch, setCoinSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(5);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching data
      await dispatch(fetchCoins(currency, sortBy, coinSearch, page, perPage));
      setLoading(false); // Set loading to false after fetching data
    };

    fetchData();
  }, [currency, sortBy, coinSearch, page, perPage, dispatch]);

  useEffect(() => {
    if (coins.length > 0) {
      setTotalPages(100);
    }
  }, [coins, perPage]);

  const handleAddToWatchlist = (coin) => {
    dispatch(addToWatchlist(coin));
  };

  const handleRemoveFromWatchlist = (id) => {
    dispatch(removeFromWatchlist(id));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const ellipsis = "...";

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 3) {
        pageNumbers.push(1, 2, 3, 4, ellipsis, totalPages);
      } else if (page > totalPages - 3) {
        pageNumbers.push(
          1,
          ellipsis,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          ellipsis,
          page - 1,
          page,
          page + 1,
          ellipsis,
          totalPages
        );
      }
    }

    return pageNumbers.map((pageNumber, index) =>
      pageNumber === ellipsis ? (
        <span key={index} className="px-4 py-2">
          {ellipsis}
        </span>
      ) : (
        <button
          key={index}
          onClick={() => handlePageChange(pageNumber)}
          className={`px-4 py-2 rounded-lg ${
            page === pageNumber
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {pageNumber}
        </button>
      )
    );
  };

  const createTableRows = (items) => {
    // console.log(items);
    return items.map((item) => (
      <tr key={item.id} className="border-b">
        <td className="py-2 px-4">
          <Link href={`/${item.id}`}>
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
          </Link>
        </td>
        <td className="py-2 px-4">{item.current_price}</td>
        <td className="py-2 px-4">{item.market_cap}</td>
        <td className="py-2 px-4">{item.high_24h}</td>
        <td className="py-2 px-4">{item.low_24h}</td>
        <td
          className={`py-2 px-4 ${
            item.price_change_percentage_24h < 0
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {item.price_change_24h.toFixed(2)} (
          {item.price_change_percentage_24h.toFixed(2)}%)
        </td>
        <td
          className={`py-2 px-4 ${
            item.market_cap_change_percentage_24h < 0
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {item.market_cap_change_24h.toFixed(2)} (
          {item.market_cap_change_percentage_24h.toFixed(2)}
          %)
        </td>
        <td className="py-2 px-4">
          <button
            onClick={() => handleAddToWatchlist(item)}
            className="bg-blue-500 text-white px-4 py-1 rounded-lg"
          >
            Add to Watchlist
          </button>
        </td>
      </tr>
    ));
  };

  const createWatchlistRows = (items) => {
    return items.map((item) => (
      <tr key={item.id} className="border-b">
        <td className="py-2 px-4">
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
        </td>
        <td className="py-2 px-4">{item.current_price}</td>
        <td className="py-2 px-4">
          <button
            onClick={() => handleRemoveFromWatchlist(item.id)}
            className="bg-red-500 text-white px-4 py-1 rounded-lg"
          >
            Remove
          </button>
        </td>
      </tr>
    ));
  };

  const filterCoins = () => {
    switch (filter) {
      case "gainers":
        return coins.filter((coin) => coin.price_change_percentage_24h > 0);
      case "losers":
        return coins.filter((coin) => coin.price_change_percentage_24h < 0);
      default:
        return coins;
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="loader"> </div>
        </div>
      ) : (
        <div className="container mx-auto mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                All Coins
              </button>
              <button
                onClick={() => handleFilterChange("gainers")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "gainers"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Gainers
              </button>
              <button
                onClick={() => handleFilterChange("losers")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "losers"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Losers
              </button>
              <button
                onClick={() => handleFilterChange("recently_sold")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "recently_sold"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Recently Sold
              </button>
            </div>
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Market Cap</th>
                  <th className="py-2 px-4 text-left">High (24h)</th>
                  <th className="py-2 px-4 text-left">Low (24h)</th>
                  <th className="py-2 px-4 text-left">Change (24h)</th>
                  <th className="py-2 px-4 text-left">
                    Market Cap Change (24h)
                  </th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>{createTableRows(filterCoins())}</tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${
                  page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
                }`}
              >
                Previous
              </button>
              <div className="flex space-x-2">{renderPagination()}</div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  page === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-green-600">Watchlist</h2>
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Price</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>{createWatchlistRows(watchlist)}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoDashboard;

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoSearchOutline } from "react-icons/io5";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(true);
  const dropdownRef = useRef(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const searchCoin = async () => {
      if (debouncedSearch !== "") {
        try {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/search?query=${debouncedSearch}`
          );
          const data = await response.json();
          setResults(data.coins);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    };

    searchCoin();
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-green-400 shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex justify-center items-center">
          <Link href="/" className="text-white font-bold text-lg">
            Crypto Dashboard
          </Link>
          <Link
            href="/explorer"
            className="text-white font-bold ml-4 bg-sky-800 p-2 rounded-lg"
          >
            Explorer
          </Link>
        </div>
        <div
          ref={dropdownRef}
          className="relative flex w-full md:w-96 justify-center items-center rounded-md"
        >
          <IoSearchOutline className="absolute top-3 left-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="w-full py-2 pl-9 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-gray-300"
          />
          {showDropdown && (
            <div className="absolute top-full left-0 w-full mt-1 max-h-52 overflow-y-scroll rounded-md bg-gray-50 custom-scrollbar shadow-md">
              {results.map((coin) => (
                <Link
                  href={`/${coin.id}`}
                  onClick={() => {
                    setSearch("");
                    setShowDropdown(false);
                  }}
                  key={coin.id}
                >
                  <div className="cursor-pointer font-semibold flex justify-start items-center p-2 hover:bg-gray-100">
                    <Image
                      src={coin.thumb}
                      alt={coin.name}
                      className="w-6 h-6 mr-2"
                      width={20}
                      height={20}
                    />
                    <span>
                      {coin.name} ({coin.symbol})
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

function useDebounce(value) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

export default Navbar;

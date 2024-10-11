"use client";
import React from "react";

const Loader = () => {
  return (
    <div className="loader">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="50"
        height="50"
        className="animate-spin"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="blue"
          strokeWidth="10"
          fill="none"
          strokeDasharray="283"
          strokeDashoffset="75"
        />
      </svg>
    </div>
  );
};

export default Loader;

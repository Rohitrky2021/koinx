"use client"
import Image from "next/image";

 
// import LineChart from "@/components/LineChart";
// import Navbar from "@/components/navbar";
import LineChart from '../../components/LineChart';
import Navbar from '../../components/navbar';


export default function Home() {
  return (
    <main>
      <Navbar />
      <LineChart coins={"ethereum,staked-ether"} />
    </main>
  );
}

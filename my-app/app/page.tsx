"use client";
import React, {useEffect} from "react";
import { type BaseError, useWriteContract, useReadContract, useAccount} from "wagmi";

export default function Home() {

  const {isConnected, address} = useAccount();
  useEffect(() => {}, [isConnected]);
  const {writeContract} = useWriteContract();

  const handleIncrement = () => {
   writeContract({
    address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
    abi:[{"type":"function","name":"counter","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"increment","inputs":[],"outputs":[],"stateMutability":"nonpayable"}],
    functionName: "increment",
    args: []
   });
  }


  const {data, isPending, refetch, error} = useReadContract({
    address: "0x86d2C5BEd33FBF1Bdc22bcd47db45B6465f3E241",
    abi:[{"type":"function","name":"counter","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"increment","inputs":[],"outputs":[],"stateMutability":"nonpayable"}],
    functionName: "counter",
    args: []
   });

   const handleGetCounter = async () => {
    await refetch();
   }

  return (
    <>
       <w3m-button/> 
       <w3m-network-button />

       <button onClick={handleIncrement}>  Increment </button>
       <div>Counter value: {isPending ? "loading ..." : data}</div>
       <button onClick={handleGetCounter}>Get Counter</button>
       {error ? <div>{((error as unknown) as BaseError).shortMessage}</div> : null }
       {isConnected ? <div> Connected: {address}</div> : "Not Connected"}
    </>
  );
}

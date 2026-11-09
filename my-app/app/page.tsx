"use client";
import React, {useEffect} from "react";
import { type BaseError } from "viem";
import { useWriteContract, useReadContract, useAccount} from "wagmi";
import {wagmiContractConfig} from "./contractsUtils";
import {writeToContract} from "./utils";


export default function Home() {

  const {isConnected, address} = useAccount();
  useEffect(() => {}, [isConnected]);
  const {writeContract} = useWriteContract();






  // const {data, isPending, refetch, error} = useReadContract({
  //  ...wagmiContractConfig,
  //   functionName: "counter",
  //  });

  //  const handleGetCounter = async () => {
  //   await refetch();
  //  }

  return (
    <>
       <w3m-button/> 
       <w3m-network-button />

       <button onClick={() => writeToContract( writeContract, "dapp", "increment")}>  Increment </button>
        {
          /*
                 <div>
  Counter value: {isPending ? "Loading..." : data?.toString()}
</div>

<button onClick={handleGetCounter}>Get Counter</button>
{error ? <div>{((error as unknown) as BaseError).shortMessage}</div> : null }

          */


        }

       
       
       {isConnected ? <div> Connected: {address}</div> : "Not Connected"}
    </>
  );
}

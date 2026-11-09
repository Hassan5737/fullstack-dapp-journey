  import {wagmiContractConfig} from "./contractsUtils";

  export const writeToContract = (writeContract: any, contractName: keyof typeof wagmiContractConfig, functionName: string) => {
   writeContract({
    ...wagmiContractConfig[contractName],
    functionName,
   });
  }
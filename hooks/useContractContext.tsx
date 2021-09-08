import React from "react";
import Web3 from 'web3';
import useWeb3, { useWeb3Props } from "./useWeb3";
import { Contract } from 'web3-eth-contract';

interface ContractData<T = {}> {
  web3: null | Web3;
  connect: () => void | Promise<void>;
  contracts: null | {
    [key in keyof Required<T>]: Contract;
  };
  accounts: string[] | null;
  selectedAccount: string | null;
  setSelectedAccount: (acc: string) => any;
  netId: number | null;
}

const noop = () => {};

export const ContractContext = React.createContext<ContractData>({ web3: null, contracts: null, accounts: null, selectedAccount: null, netId: null, setSelectedAccount: noop, connect: noop });

export function useContractContext<T = {}>() {
  return React.useContext(ContractContext) as ContractData<T>;
}

interface ContractProviderProps<T> extends useWeb3Props {
  contracts: {
    [key in keyof Required<T>]: {
      abi: any;
      address: string;
    }
  };
  children: React.ReactElement;
}

export function ContractProvider<T>({ contracts: contractMetas, children, ...web3Props }: ContractProviderProps<T>) {

  const { web3, ...web3Rest } = useWeb3(web3Props);

  const [accounts, setAccounts] = React.useState<string[] | null>(null);
  const [selectedAccount, setSelectedAccount] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!web3) return;
    web3.eth.getAccounts().then(arr => {
      setAccounts(arr);
      if (0 < arr.length){
        setSelectedAccount(arr[0]);
      }
    });
  }, [web3]);

  const contracts = React.useMemo(() => {
    if (!web3) return null;
    return Object.fromEntries(Object.entries(contractMetas).map(([key, { abi, address }]: any) => {
      return [key, new web3.eth.Contract(abi, address)];
    }))
  }, [contractMetas, web3]);

  return (
    <ContractContext.Provider value={{ web3, ...web3Rest, contracts, accounts, selectedAccount, setSelectedAccount }}>
      {children}
    </ContractContext.Provider>
  );
}
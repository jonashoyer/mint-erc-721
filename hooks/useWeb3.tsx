import React from 'react';
import Web3 from 'web3';

export interface useWeb3Props { provider?: string, autoConnect?: boolean, replaceOnChainChanged?: boolean };

function useWeb3(props: useWeb3Props) {

  const [web3, setWeb3] = React.useState<Web3 | null>(null);

  const connect = React.useCallback(async () => {

      const { ethereum, web3 } = window as any;
      
      if (ethereum) {
        ethereum.request({ method: 'eth_requestAccounts' });
        
        props.replaceOnChainChanged && ethereum.on('chainChanged', () => window.location.reload());
        return setWeb3(new Web3(ethereum));
      }
      
      if (web3) {
        return setWeb3(new Web3(web3.currentProvider));
      }

      return setWeb3(new Web3(props.provider!));
  }, [props.provider, props.replaceOnChainChanged]);

  React.useEffect(() => {
    if (!props.autoConnect) return;
    connect();
  }, [connect, props.autoConnect]);



  return { web3, connect };
}

export default useWeb3;
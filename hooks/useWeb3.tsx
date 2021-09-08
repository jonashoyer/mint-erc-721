import React from 'react';
import Web3 from 'web3';

export interface useWeb3Props { provider?: string, autoConnect?: boolean, reloadOnChainChanged?: boolean };

function useWeb3(props: useWeb3Props) {

  const [web3, setWeb3] = React.useState<Web3 | null>(null);
  const [netId, setNetId] = React.useState<number | null>(null);

  const connect = React.useCallback(async () => {

    const gotWeb3 = (web3: Web3) => {
      web3?.eth.net.getId().then(setNetId);
      if (props.reloadOnChainChanged && ethereum) {
        const reload = () => window.location.reload();
        ethereum.on('networkChanged', reload);
        ethereum.on('chainChanged', reload);
      }
      setWeb3(web3);
    }

    const { ethereum, web3 } = window as any;

    if (ethereum) {
      ethereum.request({ method: 'eth_requestAccounts' });

      return gotWeb3(new Web3(ethereum));
    }

    if (web3) {
      return gotWeb3(new Web3(web3.currentProvider));
    }

    return gotWeb3(new Web3(props.provider!));
  }, [props.provider, props.reloadOnChainChanged]);

  React.useEffect(() => {
    if (!props.autoConnect) return;
    connect();
  }, [connect, props.autoConnect]);

  return { web3, connect, netId };
}

export default useWeb3;
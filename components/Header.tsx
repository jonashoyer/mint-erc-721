import { Alert, Button, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React from 'react';
import { useContractContext } from '../hooks/useContractContext';

const Header = () => {

  const { accounts, selectedAccount, connect, netId } = useContractContext();
  const hasWallet = accounts !== null;
  console.log(netId);
  return (
    <React.Fragment>
      {netId != null && netId != 1 && netId != 5777 && <Alert severity="error">Change to ethereum mainnet!</Alert>}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
        {selectedAccount && <Typography>{selectedAccount.slice(0, 8)}...{selectedAccount.slice(-6)}</Typography>}
        {!hasWallet && <Button color="inherit" variant='outlined' onClick={connect}>Connect MetaMask</Button>}
      </Box>
    </React.Fragment>
  )
}

export default Header;
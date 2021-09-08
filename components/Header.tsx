import { Button, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React from 'react';
import { useContractContext } from '../hooks/useContractContext';

const Header = () => {

  const { accounts, selectedAccount, connect } = useContractContext();
  const hasWallet = accounts !== null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
      {selectedAccount && <Typography>{selectedAccount.slice(0, 8)}...{selectedAccount.slice(-6)}</Typography>}
      {!hasWallet && <Button color="inherit" variant='outlined' onClick={connect}>Connect MetaMask</Button>}
    </Box>
  )
}

export default Header;
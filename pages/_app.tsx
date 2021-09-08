import React from 'react';
import type { AppProps } from 'next/app'
import { ContractProvider } from '../hooks/useContractContext';
import { createTheme, ThemeProvider } from '@material-ui/core';
import BetterNFT from '../build/contracts/BetterNFT.json';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <ContractProvider
        autoConnect
        contracts={{
          betterNFT: {
            abi: BetterNFT.abi,
            address: BetterNFT.networks['5777'].address,
          }
        }}
      >
        <Component {...pageProps} />
      </ContractProvider>
    </ThemeProvider>
  )
}
export default MyApp

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      }
    },
  }
});
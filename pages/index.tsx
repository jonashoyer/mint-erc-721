import React from 'react'
import type { NextPage } from 'next'
import { Box, Button, Typography } from '@material-ui/core'
import { useContractContext } from '../hooks/useContractContext';
import Header from '../components/Header';
import Web3 from 'web3';

const Home: NextPage = () => {
  const { selectedAccount, contracts } = useContractContext<{ betterNFT: true }>();
  const [ownedTokens, setOwnedTokens] = React.useState<string[] | null>(null);
  const [maxTokenSupply, setMaxTokenSupply] =  React.useState();
  const [totalSupply, setTotalSupply] =  React.useState();
  
  const mintHandler = () => {
    contracts?.betterNFT.methods.mint().send({ value: Web3.utils.toWei('0.1', 'ether'), from: selectedAccount });
  }
  
  const fetchNFTList = React.useCallback(async () => {
    try {

      if (!selectedAccount) return;
      const maxTokenSupply = await contracts?.betterNFT.methods.maxTokenSupply().call();
      setMaxTokenSupply(maxTokenSupply);
      
      const totalSupply = await contracts?.betterNFT.methods.totalSupply().call();
      setTotalSupply(totalSupply);
      
      const balance = Number(await contracts?.betterNFT.methods.balanceOf(selectedAccount).call());
      const allPTokens = [...Array(balance)].map((_, i) => {
        return contracts?.betterNFT.methods.tokenOfOwnerByIndex(selectedAccount, i).call();
      })
      
      const tokens = await Promise.all(allPTokens);
      setOwnedTokens(tokens);
    } catch (err) {
      console.error(err);
      // TODO: Wrong network?
    }
  }, [contracts?.betterNFT.methods, selectedAccount]);
  

  React.useEffect(() => {
    fetchNFTList();
  }, [fetchNFTList]);

  
  return (
    <Box>
      <Header />

      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ mb: 6 }} variant='h2'>Better NFT</Typography>
        <Typography sx={{ mb: 2 }} variant='h5'>{totalSupply} / {maxTokenSupply}</Typography>
        <Button sx={{ px: 7, py: 1.5 }} size='large' variant='outlined' onClick={mintHandler}>Mint!</Button>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography sx={{ mb: 1 }} variant='subtitle1'>Your Collection ({ownedTokens?.length})</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {ownedTokens?.map(i => 
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} alt={`${i}`} src={`/api/img/${i}`} style={{ height: 128, width: 128 }} />
            )}
        </Box>
      </Box>
    </Box>
  )
}

export default Home

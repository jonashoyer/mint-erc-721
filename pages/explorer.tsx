import React from 'react'
import type { NextPage } from 'next'
import { Box, Button, Paper, Typography } from '@material-ui/core'
import { useContractContext } from '../hooks/useContractContext';
import axios from 'axios';
import Header from '../components/Header';

const PAGE_SIZE = 14 * 7;

const Home: NextPage = () => {
  const { web3, accounts, selectedAccount, contracts, connect } = useContractContext<{ betterNFR: true }>();
  const hasWallet = accounts !== null;

  const [page, setPage] = React.useState(0);

  const [metaMapping, setMetaMapping] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    
    if (loading) return;

    const fetchIds = [...Array(PAGE_SIZE)].reduce((ids, _, i) => {
      const index = page * PAGE_SIZE + i;
      if (metaMapping[index]) return ids;
      return [...ids, index];
    }, [])

    console.log({fetchIds});
    if (fetchIds.length == 0) return;

    setLoading(true);
    const p = fetchIds.map(async (i) => {
      const res = await axios.get(`/api/meta/${i}`);
      return res.data;
    })

    Promise.all(p).then((arr) => {
      const data = Object.fromEntries(arr.map((e: any) => ([e.index, e])));
      setMetaMapping({ ...metaMapping, ...data });
      setLoading(false);
    });

  }, [loading, metaMapping, page]);

  return (
    <Box>
      <Header />      

      <Box>
        <Button onClick={() => setPage(page - 1)}>{'<'}</Button>
        {page}
        <Button onClick={() => setPage(page + 1)}>{'>'}</Button>
      </Box>
      <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[...Array(PAGE_SIZE)].map((_, i) => {
          const index = page * PAGE_SIZE + i;
          const meta = metaMapping[index];
          return (
            <Box key={index}>
              <img alt={`${index}`} src={`/api/img/${index}`} style={{ height: 128, width: 128 }} />
              <Typography>{index}</Typography>
              <Typography>W {((meta?.sum[0] / (16*16))* 100).toFixed(2)}%</Typography>
              <Typography>B {((meta?.sum[1] / (16*16))* 100).toFixed(2)}%</Typography>
              <Typography>C {((meta?.artifacts.checker.length / (16*16))* 100).toFixed(2)}%</Typography>
              {meta?.attributes.map((e: any, i) => (
                <Typography key={i}>{e.name}</Typography>
              ))}
            </Box>
            )
          }
        )}
      </Box>
    </Box>
  )
}

export default Home

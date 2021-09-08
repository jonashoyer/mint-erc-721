import React from 'react'
import type { NextPage } from 'next'
import { Box, Button, Paper, Typography } from '@material-ui/core'
import axios from 'axios';
import Header from '../../components/Header';
import { useRouter } from 'next/router'

const Home: NextPage = ({  }) => {

  const router = useRouter()
  const { index } = router.query

  const [meta, setMeta] = React.useState<{ pattern: string, index: number, sum: number[], artifacts: any, attributes: any } | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    
    if (loading) return;
    if (meta?.index == index) return;

    setLoading(true);
    (async () => {
      const res = await axios.get(`/api/meta/${index}`);
      setMeta(res.data);
      console.log(res.data);
      setLoading(false);
    })()

  }, [index, loading, meta]);

  return (
    <Box>
      <Header />
      <Box sx={{ p: 2, display: 'flex', gap: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', width: 16 * 16, border: '1px solid #000' }}>
          {meta?.pattern.split('').map((e, i) => (
            <Box key={i} sx={{ height: 16, width: 16, bgcolor: colorMapping[e] }} />
          ))}
        </Box>
        <Box>
          <Typography>#{index}</Typography>
          <Typography>White {(((meta?.sum[0] ?? 0) / 256) * 100).toFixed(2)}%</Typography>
          <Typography>Black {(((meta?.sum[1] ?? 0) / 256) * 100).toFixed(2)}%</Typography>
          <Typography>Checker Pattern {(((meta?.artifacts.checker.length ?? 0) / 256) * 100).toFixed(2)}%</Typography>
          {meta?.attributes.map((e: any, i: number) => (
            <Typography key={i}>{e.name}</Typography>
          ))}
          {meta?.artifacts.eyes.map((e: any, i: number) => (
            <Typography variant='overline' key={i}>{e.name}</Typography>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

const colorMapping: Record<string, string> = {
  '0': '#fff',
  '1': '#000',
  '2': '#0f0',
  '3': '#00f',
  '4': '#f00', 
}

export default Home

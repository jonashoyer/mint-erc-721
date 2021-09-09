import React from 'react'
import type { NextPage } from 'next'
import { Box, Button, Typography } from '@material-ui/core'
import axios from 'axios';
import Header from '../components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { Link as MuiLink } from '@material-ui/core';

const PAGE_SIZE = 14 * 7;

const Home: NextPage = () => {

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

    if (fetchIds.length == 0) return;

    setLoading(true);
    const p = fetchIds.map(async (i: string) => {
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
              <Image alt={`${index}`} src={`/api/img/${index}`} height={128} width={128} />
              <Link passHref href={`/t/${index}`}>
                <MuiLink sx={{ display: 'block', color: t => t.palette.text.primary, textDecoration: 'none', lineHeight: '1' }}>{index}</MuiLink>
              </Link>
              {meta && <Typography variant='body2' fontSize={11}>{(meta.sum[0] / 2.56).toFixed(2)}% {(meta.sum[1] / 2.56).toFixed(2)}% {(meta.artifacts.checker.length / 2.56).toFixed(2)}%</Typography>}
              {meta?.attributes.map((e: any, i: number) => (
                <Typography key={i} sx={{ lineHeight: '1.15' }} variant='overline'>{e.name}</Typography>
              ))}
              {meta?.artifacts.eyes.map((e: any, i: number) => (
                <Typography variant='overline' key={i}>{e.name}</Typography>
              ))}
            </Box>
            )
          }
        )}
      </Box>
      <Box>
        <Button onClick={() => setPage(page - 1)}>{'<'}</Button>
        {page}
        <Button onClick={() => setPage(page + 1)}>{'>'}</Button>
      </Box>
    </Box>
  )
}

export default Home

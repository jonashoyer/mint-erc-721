// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto';
import Jimp from 'jimp';
import seedrandom from 'seedrandom';

export interface prng {
  (): number;
}

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { id } = req.query;

  const rng = seedrandom(id as string);


  // const img = await generatePngImage(16);
  // res.setHeader('Content-Type', 'image/png');
  // res.send(img as any);

  const svg = generateSvgImage(rng, 16);
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg as any);
}


export const drawMapping = [{
  color: [255, 255, 255],
  value: 609,
  label: 'White',
}, {
  color: [0, 0, 0],
  value: 368,
  label: 'Black',
}, {
  color: [0, 255, 0],
  value: 14,
  label: 'Green',
}, {
  color: [0, 0, 255],
  value: 8,
  label: 'Blue',
}, {
  color: [255, 0, 0],
  value: 1,
  label: 'Red',
}]
export const drawMappingMaxValue = drawMapping.reduce((t, e) => t + e.value, 0);

const getRandomColor = (rng: prng, maxInt: number) => {
  const r = Math.floor(rng() * maxInt);

  const result = drawMapping.reduce<{ counter: number, color: number[] | null }>(({ counter, color }, e) => {
    if (color) return { counter, color };
    if (r >= counter + e.value) return { counter: counter + e.value, color };
    return { counter, color: e.color };
  }, { counter: 0, color: null })
  return result.color;
}

const generatePngImage = (rng: prng, size: number) => {
  return new Promise<Buffer>(r => {

    new Jimp(size, size, async (err, img) => {
      if (err) throw err;
      
      [...Array(size)].forEach((_, x) => {
        [...Array(size)].forEach((_, y) => {
          const [r, g, b] = getRandomColor(rng, drawMappingMaxValue)!;
          const col = Jimp.rgbaToInt(r, g, b, 255);
          img.setPixelColor(col!, x, y);
        })
      })
      
      const buf = img.getBufferAsync(Jimp.MIME_PNG);
      r(buf);
    })
  })
}

const generateSvgImage = (rng: prng, size: number) => {
  const bgColor = drawMapping[0].color;
  return `
  <?xml version="1.0" standalone="no"?>
  <svg width="${size}" height="${size}" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="rgb(${bgColor[0]},${bgColor[1]},${bgColor[2]})"  />
    ${
      [...Array(size)].map((_, y) => {
        return [...Array(size)].reduce((arr, _, x) => {
          const col = getRandomColor(rng, drawMappingMaxValue)!;
          if (col == bgColor) return arr;
          const [r, g, b] = col;
          arr.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="rgb(${r},${g},${b})" />`);
          return arr;
        }, [])
      }).flat(Number.MAX_VALUE).join('\n')
    }
  </svg>
  `.trim();
}
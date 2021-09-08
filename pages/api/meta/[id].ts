// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import seedrandom from 'seedrandom';
import { drawMapping, drawMappingMaxValue, prng } from '../img/[id]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { id } = req.query;

  const rng = seedrandom(id as string);


  const mapping = getMapping(rng, 16);

  const sum = [0, 0, 0, 0, 0];

  const artifacts: any = { checker: [] };

  const m = mapping.flat();

  m.forEach((e, i) => {
    sum[e.index]++;

    if (e.index == 0 || e.index == 1) {

      const isInv = (p: any) => p && ((e.index == 0 && p.index == 1) || (e.index == 1 && p.index == 0));

      const hasL = i % 16 != 0;
      const hasR = i - 1 % 16 != 0;
      const tl = hasL ? m[i - 17] : null;
      const t = m[i - 16];
      const tr = hasR ? m[i - 15] : null;
      const l = hasL ? m[i - 1] : null;
      const r = hasR ? m[i + 1] : null;
      const bl = hasL ? m[i + 15] : null;
      const b = m[i + 16];
      const br = m[i + 17];

      
      const detectCheckerPattern = () => {

        const ct = isInv(t);
        const cl = isInv(l);
        const cr = isInv(r);
        const cb = isInv(b);
        
        if (ct) {
          if (cl && e.index === tl?.index) return artifacts.checker.push(i);
          if (cr && e.index === tr?.index) return artifacts.checker.push(i);
        }
        
        if (cb) {
          if (cl && e.index === bl?.index) return artifacts.checker.push(i);
          if (cr && e.index === br?.index) return artifacts.checker.push(i);
        }
      }


      detectCheckerPattern();
    }
  })

  const attributes = [];
  
  //TODO:  Eyes

  if ((sum[2] + sum[3] + sum[4]) == 0) attributes.push({ name: 'Black and White' });
  if (sum[4] >= 3) attributes.push({ name: `${sum[4]} red pixels` });
  if (sum[0] >= (16 * 16 * .8)) attributes.push({ name: `Whiteout` });
  if (sum[1] >= (16 * 16 * .5)) attributes.push({ name: `Blackout` });
  if (artifacts.checker.length >= 115) attributes.push({ name: 'Checker Pattern' });

  res.send({
    index: Number(id),
    pattern: m.map(e => e.index).join(''),
    artifacts,
    attributes,
    sum,
  });
}

const getRandomItem = (rng: prng, maxInt: number) => {
  const r = Math.floor(rng() * maxInt);

  const result = drawMapping.reduce<{ counter: number, index: number | null }>(({ counter, index }, e, i) => {
    if (index != null) return { counter, index };
    if (r >= counter + e.value) return { counter: counter + e.value, index: null };
    return { counter, index: i };
  }, { counter: 0, index: null });
  return { ...drawMapping[result.index!], index: result.index! };
}

const getMapping = (rng: prng, size: number) => {
  return [...Array(size)].map((_, x) => {
    return [...Array(size)].map((_, y) => {
      return {
        ...getRandomItem(rng, drawMappingMaxValue)!,
        x,
        y,
      };
    })
  })
}
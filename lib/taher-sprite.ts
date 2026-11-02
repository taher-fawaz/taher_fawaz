// Pixel-art Taher (16×24), drawn from his photos: swept-up dark hair, full beard, big smile,
// burgundy button-down shirt, dark trousers. Pure data so it can be unit-tested and previewed.

export const SPRITE_W = 16
export const SPRITE_H = 24

export const PALETTE: Record<string, string> = {
  O: '#17171A', // outline (site ink)
  H: '#221C1B', // hair
  h: '#4A3B37', // hair highlight
  S: '#F2C7A2', // skin
  s: '#D9A27C', // skin shade
  E: '#221C1B', // brows and eyes
  B: '#2E2523', // beard
  W: '#FFFFFF', // teeth
  R: '#7B1F33', // burgundy shirt
  r: '#5C1626', // shirt shade
  b: '#E8C9CF', // buttons
  P: '#232838', // trousers
  K: '#111114', // shoes
}

const HEAD = [
  '.....OOOOOOO....',
  '...OOHHHHHhhO...',
  '..OHHHHHHHhhHO..',
  '..OHHHHHHHHHHO..',
  '..OHHSSSSSSSHO..',
  '..OHSSSSSSSSSO..',
  '..OSEESSSSEESO..',
  '.OsSESSSSSSESsO.',
  '..OBSSSsSSSSBO..',
  '..OBBSBBBBSBBO..',
  '..OBBBWWWWBBBO..',
  '..OBBBBBBBBBBO..',
  '...OBBBBBBBBO...',
]
const BLINK_EYES = '.OsSsSSSSSSsSsO.'

const BODY = [
  '....OOSSSSOO....',
  '..OORRRSSRRROO..',
  '.ORRRRRRbRRRRRO.',
  '.ORrRRRRRRRRrRO.',
  '.ORrRRRRbRRRrRO.',
  '.OSrRRRRRRRRrSO.',
  '.OSORRRRbRRRRSO.',
]
const LEGS_STAND = ['..OPPPPPPPPPPO..', '..OPPPPOOPPPPO..', '..OPPPO..OPPPO..', '..OKKKO..OKKKO..']
const LEGS_WALK_A = ['..OPPPPPPPPPPO..', '..OPPPPOOPPPPO..', '.OPPPO....OPPO..', '.OKKKO....OKKO..']
const LEGS_WALK_B = ['..OPPPPPPPPPPO..', '..OPPPPOOPPPPO..', '...OPPO..OPPPO..', '...OKKO..OKKKO..']

const CHEER_TOP = [
  ...HEAD.slice(0, 9),
  'S.OBBSBBBBSBBO.S',
  'R.OBBBWWWWBBBO.R',
  'R.OBBBBBBBBBBO.R',
  'RR.OBBBBBBBBO.RR',
]
const CHEER_BODY = [
  '.RRROOSSSSOORRR.',
  '..ORRRRSSRRRRO..',
  '.ORRRRRRbRRRRRO.',
  '.ORrRRRRRRRRrRO.',
  '.ORrRRRRbRRRrRO.',
  '.ORRRRRRRRRRRRO.',
  '.ORRRRRRbRRRRRO.',
]

const withBlink = (rows: string[]) => rows.map((r, i) => (i === 7 ? BLINK_EYES : r))

export type Pose = 'idle' | 'blink' | 'walkA' | 'walkB' | 'cheer'
export const FRAMES: Record<Pose, string[]> = {
  idle: [...HEAD, ...BODY, ...LEGS_STAND],
  blink: [...withBlink(HEAD), ...BODY, ...LEGS_STAND],
  walkA: [...HEAD, ...BODY, ...LEGS_WALK_A],
  walkB: [...HEAD, ...BODY, ...LEGS_WALK_B],
  cheer: [...CHEER_TOP, ...CHEER_BODY, ...LEGS_STAND],
}

/** Horizontal runs of one colour, so a frame becomes a handful of <rect>s instead of 384. */
export function toRuns(rows: string[]) {
  const runs: { x: number; y: number; w: number; fill: string }[] = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]!
      let end = x + 1
      while (end < row.length && row[end] === ch) end++
      const fill = PALETTE[ch]
      if (fill) runs.push({ x, y, w: end - x, fill })
      x = end
    }
  })
  return runs
}

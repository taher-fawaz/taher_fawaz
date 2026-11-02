// Pixel landmarks (16×20) for the cities on the career map, plus the graduation cap for its first stop. Pure data, unit-tested.
// Each company gets its own landmark; companies in the same city get different ones, in order.

export const LANDMARK_W = 16
export const LANDMARK_H = 20

export const LANDMARK_PALETTE: Record<string, string> = {
  K: '#17171A', // tips, antennas
  G: '#5F5E59', // ground
  S: '#E3B66B', // sandstone
  s: '#C8954A', // sandstone shade
  C: '#E8D9C4', // pale stone
  c: '#B9A58A', // pale stone shade
  L: '#CFD8E3', // steel and glass
  l: '#8FA3BC', // steel shade
  B: '#7FA6FF', // blue glass
  b: '#4F78D9', // blue glass shade
  W: '#FFFFFF', // white
  D: '#3A3A3F', // windows
  R: '#FF5B1F', // beacon
  g: '#2BC48A', // greenery
  Y: '#FFC93C', // tassel
}

const E = '................'
const GROUND = 'GGGGGGGGGGGGGGGG'

export const LANDMARKS = {
  pyramids: [E, E, E, E, E, E,
    '......S.........', '.....SSs........', '.....SSss.......', '....SSSss.......', '....SSSsss......', '...SSSSsss......',
    '...SSSSssss..S..', '..SSSSSssss.SSs.', '..SSSSSsssssSSs.', '.SSSSSSsssssSSss', '.SSSSSSssssssSSs', 'SSSSSSSssssssSSs',
    'SSSSSSSsssssssss', GROUND],
  cairoTower: [
    '.......K........', '.......K........', '......RRR.......', '.....CCCCC......', '.....DDDDD......', '......CCC.......',
    '......CcC.......', '......CCC.......', '......cCc.......', '......CCC.......', '......CcC.......', '......CCC.......',
    '......cCc.......', '......CCC.......', '.....CCCCC......', '.....CcCcC......', '....CCCCCCC.....', '....CCCCCCC.....',
    '...CCCCCCCCC....', GROUND],
  sphinx: [E, E, E, E, E, E, E, E,
    '..SS............', '.SSSS...........', '.SKSS...........', '.SSSs...........', '.SSSSs..........', '..SSSSSSSSSSs...',
    '..SSSSSSSSSSSs..', '.SSSSSSSSSSSSSs.', 'SSSSSSSSSSSSSSSs', 'SSSSSSssSSSSSSSs', 'ssssssssssssssss', GROUND],
  citadel: [
    '..K..........K..', '..C..........C..', '..C..........C..', '..C..........C..', '.CCC........CCC.', '..C....K.....C..',
    '..C...CCC....C..', '..C..CCCCC...C..', '.CCC.CCCCC..CCC.', '..C.CCCCCCC..C..', '..C.CCCCCCC..C..', '..CCCCCCCCCCCC..',
    '..CCDCCDCCDCCC..', '..CCCCCCCCCCCC..', '.CCCCCCCCCCCCCC.', '.CCDDCCDDCCDDCC.', '.CCCCCCCCCCCCCC.', 'SSSSSSSSSSSSSSSS',
    'SsSsSsSsSsSsSsSs', GROUND],
  iconic: [
    '.......K........', '.......K........', '......BBb.......', '......BBb.......', '......BBb.......', '.....BBBbb......',
    '.....BWBbb......', '.....BBBbb......', '.....BWBbb......', '....BBBBbbb.....', '....BWBBbbb.....', '....BBBBbbb.....',
    '....BWBBbbb.....', '...BBBBBbbbb....', '...BWBBBbbbb....', '...BBBBBbbbb....', '...BWBBBbbbb....', '..BBBBBBbbbbb...',
    '..BBBBBBbbbbb...', GROUND],
  burjKhalifa: [
    '.......K........', '.......L........', '.......L........', '.......Ll.......', '.......Ll.......', '......LLl.......',
    '......LLl.......', '......LLll......', '.....LLLll......', '.....LLLll......', '.....LLLlll.....', '....LLLLlll.....',
    '....LLLLlll.....', '....LLLLllll....', '...LLLLLllll....', '...LLLLLlllll...', '..LLLLLLlllll...', '..LLLLLLllllll..',
    '.LLLLLLLllllll..', GROUND],
  klTower: [
    '.......K........', '.......R........', '.......L........', '.......L........', '......LLL.......', '.....BBBBB......',
    '....BBBBBBB.....', '....LLLLLLL.....', '.....LLLLL......', '......LlL.......', '......LlL.......', '......LlL.......',
    '......LlL.......', '......LlL.......', '......LlL.......', '.....LLlLL......', '.....LLlLL......', '....LLLlLLL.....',
    '...gggggggggg...', GROUND],
  petronas: [
    '...K........K...', '...L........L...', '..LLL......LLL..', '..LLL......LLL..', '..LlL......LlL..', '.LLLLL....LLLLL.',
    '.LlLlL....LlLlL.', '.LLLLL....LLLLL.', '.LlLlLKKKKLlLlL.', '.LLLLL....LLLLL.', 'LLLLLLL..LLLLLLL', 'LlLlLlL..LlLlLlL',
    'LLLLLLL..LLLLLLL', 'LlLlLlL..LlLlLlL', 'LLLLLLL..LLLLLLL', 'LlLlLlL..LlLlLlL', 'LLLLLLL..LLLLLLL', 'LLLLLLL..LLLLLLL',
    'LLLLLLLLLLLLLLLL', GROUND],
  gradCap: [E, E, E, E, E, E,
    '.......KK.......', '.....KKDDKK.....', '...KKDDDDDDKK...', '.KKDDDDKKDDDDKK.', '...KKDDDDDDKKY..', '.....KKDDKK..Y..',
    '....DKKKKKKD.Y..', '....DDDDDDDD.YY.', '....DDDDDDDD.YY.', '....KDDDDDDK....', '.....KKKKKK.....', '................',
    '...WWWWRWWWWW...', GROUND],
} satisfies Record<string, string[]>

export type LandmarkId = keyof typeof LANDMARKS
export type City = 'cairo' | 'dubai' | 'kualaLumpur' | 'other'

// Order of use within a city: the first job there gets the first landmark, and so on.
const CITY_LANDMARKS: Record<City, LandmarkId[]> = {
  cairo: ['cairoTower', 'sphinx', 'citadel', 'iconic', 'pyramids'],
  dubai: ['burjKhalifa'],
  kualaLumpur: ['klTower', 'petronas'],
  other: ['iconic'],
}

export function cityOf(place: string): City {
  if (/dubai|دبي/i.test(place)) return 'dubai'
  if (/kuala|كوالا/i.test(place)) return 'kualaLumpur'
  if (/cairo|maadi|settlement|القاهرة|المعادي|التجمع/i.test(place)) return 'cairo'
  return 'other'
}

/**
 * Landmarks for places listed oldest first. The most recent job in a city gets that city's most
 * famous landmark (the last in its list), and earlier ones fill in backwards, so no two repeat
 * until a city runs out.
 */
export function assignLandmarks(places: string[]): LandmarkId[] {
  const cities = places.map(cityOf)
  const remaining: Partial<Record<City, number>> = {}
  for (const c of cities) remaining[c] = (remaining[c] ?? 0) + 1
  return cities.map((c) => {
    const list = CITY_LANDMARKS[c]
    const left = (remaining[c] = remaining[c]! - 1)
    return list[Math.max(0, list.length - 1 - left)]!
  })
}

export function landmarkRuns(id: LandmarkId) {
  const runs: { x: number; y: number; w: number; fill: string }[] = []
  LANDMARKS[id].forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]!
      let end = x + 1
      while (end < row.length && row[end] === ch) end++
      const fill = LANDMARK_PALETTE[ch]
      if (fill) runs.push({ x, y, w: end - x, fill })
      x = end
    }
  })
  return runs
}

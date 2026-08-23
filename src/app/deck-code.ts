export const TRAINER_OFFSET = 1_000_000;
export const SPECIAL_THRESHOLD = 100_000;

export const ENERGY_IDS: Record<string, number> = {
  G: 1,
  R: 2,
  W: 3,
  L: 4,
  P: 5,
  F: 6,
  D: 7,
  M: 8,
};

// Both segments store nr * 10 as big-endian 3-byte values; the game keeps
// repeated numbers as separate entries.
function packSegment(count: number, values: number[]): number[] {
  const bytes = [count];
  for (const value of values) {
    bytes.push((value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff);
  }
  return bytes;
}

export function createDeckCode(
  deckBuilderNrs: number[],
  energyIds: number[] = []
): string | null {
  if (deckBuilderNrs.length === 0) return null;

  const trainers = deckBuilderNrs
    .filter((nr) => nr >= SPECIAL_THRESHOLD)
    .sort((a, b) => a - b);
  const pokemon = deckBuilderNrs
    .filter((nr) => nr < SPECIAL_THRESHOLD)
    .sort((a, b) => a - b);

  const bytes: number[] = [
    ...packSegment(trainers.length, trainers.map((nr) => nr * 10)),
    ...packSegment(pokemon.length, pokemon.map((nr) => nr * 10)),
  ];

  // An energy block is required whenever pokémon are present, even with none.
  if (energyIds.length > 0 || pokemon.length > 0) {
    bytes.push(energyIds.length, ...energyIds);
  }

  const byteArray = Uint8Array.from(bytes);
  let binary = "";
  byteArray.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

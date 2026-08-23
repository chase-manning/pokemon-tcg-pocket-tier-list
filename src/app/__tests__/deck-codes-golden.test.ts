import { createDeckCode } from "../deck-code";
import golden from "../__fixtures__/deck-codes.json";

type GoldenEntry = [number[], number[], string];

describe("golden deck codes vs the corrected format", () => {
  Object.entries(golden as unknown as Record<string, GoldenEntry>).forEach(
    ([slug, [nrs, energyIds, expected]]) => {
      it(`reproduces ${slug}`, () => {
        expect(createDeckCode(nrs, energyIds)).toBe(expected);
      });
    }
  );

  it("covers every deck in the current snapshot", () => {
    expect(Object.keys(golden)).toHaveLength(75);
  });
});

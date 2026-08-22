import fs from "fs";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";
import { generateOgImages } from "../utils/generate-og-images";

describe("generateOgImages", () => {
  const outputDir = path.join(os.tmpdir(), "og-images-test");
  const fixtureImage = path.join(os.tmpdir(), "og-test-fixture.png");

  beforeEach(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
    process.env.OG_OUTPUT_DIR = outputDir;
    fs.writeFileSync(
      fixtureImage,
      Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        "base64"
      )
    );
  });

  afterAll(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
    delete process.env.OG_OUTPUT_DIR;
  });

  it("writes one PNG per deck and removes stale files from a prior run", async () => {
    const fixtureUrl = pathToFileURL(fixtureImage).href;
    await generateOgImages([
      { slug: "deck-a", name: "Charizard ex & Pikachu", iconUrls: [fixtureUrl] },
      { slug: "deck-b", name: "Mewtwo ex", iconUrls: [fixtureUrl] },
    ]);
    expect(fs.existsSync(path.join(outputDir, "deck-a.png"))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, "deck-b.png"))).toBe(true);

    await generateOgImages([
      { slug: "deck-a", name: "Charizard ex & Pikachu", iconUrls: [fixtureUrl] },
      { slug: "deck-c", name: "Greninja", iconUrls: [fixtureUrl] },
    ]);
    expect(fs.existsSync(path.join(outputDir, "deck-a.png"))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, "deck-b.png"))).toBe(false);
    expect(fs.existsSync(path.join(outputDir, "deck-c.png"))).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { generateDungeonMap, info } from "../../src/algorithms/dungeon";

describe("generateDungeonMap", () => {
  it("should generate a 20x20 dungeon map", () => {
    const result = generateDungeonMap();

    expect(result).toHaveLength(20);

    for (const row of result) {
      expect(row).toHaveLength(20);
    }
  });

  it("should contain the configured number of rooms", () => {
    const result = generateDungeonMap();

    const roomTiles = result.flat().filter((tile) => tile === 1);

    expect(roomTiles.length).toBe(info.numberOfRooms * 9);
  });
});

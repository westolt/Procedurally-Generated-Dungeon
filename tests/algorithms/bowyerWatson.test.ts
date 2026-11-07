import { describe, expect, it } from "vitest";
import { initializeSuperTriangleVertices } from "../../src/algorithms/bowyerWatson";

describe("initializeSuperTriangleVertices", () => {
  it("should initialize a super triangle with three vertices", () => {
    const result = initializeSuperTriangleVertices(20);

    expect(result).toHaveProperty("p1");
    expect(result).toHaveProperty("p2");
    expect(result).toHaveProperty("p3");

    expect(result.p1).toEqual({ x: 10, y: -10 });
    expect(result.p2).toEqual({ x: 30, y: 20 });
    expect(result.p3).toEqual({ x: -10, y: 20 });
  });
});

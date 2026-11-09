import { describe, expect, it } from "vitest";
import {
  getCircumcenter,
  getCircumradius,
  initializeSuperTriangleVertices,
  isInsideCircumcircle,
} from "../../src/algorithms/bowyerWatson";

interface Coordinates {
  x: number;
  y: number;
}

/**
 * Checks whether a point is inside or on the boundary of a triangle.
 *
 * @param p Coordinates of the point to check
 * @param a Coordinates of the triangle's first vertex
 * @param b Coordinates of the triangle's second vertex
 * @param c Coordinates of the triangle's third vertex
 * @returns True if the point is inside or on the triangle's boundary. Otherwise false
 * @source https://math.stackexchange.com/questions/274712/calculate-on-which-side-of-a-straight-line-is-a-given-point-located
 */
function isPointInsideTriangle(
  p: Coordinates,
  a: Coordinates,
  b: Coordinates,
  c: Coordinates,
): boolean {
  // Calculate the cross product to find out which side of each edge the point is on
  const cross = (a: Coordinates, b: Coordinates, p: Coordinates) =>
    (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

  // Calculate cross products for all three triangle edges
  const AB = cross(a, b, p);
  const BC = cross(b, c, p);
  const CA = cross(c, a, p);

  // Check if the cross products contain negative or positive values
  const hasNegative = AB < 0 || BC < 0 || CA < 0;
  const hasPositive = AB > 0 || BC > 0 || CA > 0;

  // If both positive and negative values exist, the point is outside the triangle
  return !(hasNegative && hasPositive);
}

describe("initializeSuperTriangleVertices", () => {
  // Only testing these cases for now, since the dungeon size is fixed at 20x20.
  it("should initialize a super triangle with three vertices", () => {
    const result = initializeSuperTriangleVertices(20);

    expect(result).toHaveProperty("p1");
    expect(result).toHaveProperty("p2");
    expect(result).toHaveProperty("p3");

    expect(result.p1).toEqual({ x: 10, y: -10 });
    expect(result.p2).toEqual({ x: 30, y: 20 });
    expect(result.p3).toEqual({ x: -10, y: 20 });
  });

  it("should contain all possible room center coordinates", () => {
    const size = 20;
    const triangle = initializeSuperTriangleVertices(size);

    // Check all possible room center positions
    for (let y = 2; y < 18; y++) {
      for (let x = 2; x < 18; x++) {
        const point = { x, y };

        const result = isPointInsideTriangle(point, triangle.p1, triangle.p2, triangle.p3);

        expect(result).toBe(true);
      }
    }
  });
});

describe("getCircumcenter", () => {
  it("should return a circumcenter of a triangle", () => {
    const triangle = initializeSuperTriangleVertices(20);

    const result = getCircumcenter(triangle.p1, triangle.p2, triangle.p3);

    expect(result).toHaveProperty("x");
    expect(result).toHaveProperty("y");

    expect(result.x).toEqual(10);
    expect(result.y).toBeCloseTo(11.666);
  });

  it("should calculate circumcenter of a different triangle", () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 4, y: 0 };
    const p3 = { x: 0, y: 4 };

    const result = getCircumcenter(p1, p2, p3);

    expect(result.x).toBe(2);
    expect(result.y).toBe(2);
  });

  it("should handle collinear points", () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 2, y: 2 };
    const p3 = { x: 4, y: 4 };

    const result = getCircumcenter(p1, p2, p3);

    expect(Number.isFinite(result.x)).toBe(false);
    expect(Number.isFinite(result.y)).toBe(false);
  });

  it("should calculate a circumcenter equally distant from all vertices", () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 4, y: 0 };
    const p3 = { x: 1, y: 3 };

    const center = getCircumcenter(p1, p2, p3);

    const distance = (a: Coordinates, b: Coordinates) =>
      Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

    const d1 = distance(center, p1);
    const d2 = distance(center, p2);
    const d3 = distance(center, p3);

    expect(d1).toBeCloseTo(d2);
    expect(d2).toBeCloseTo(d3);
  });
});

describe("getCircumradius", () => {
  it("should return a circumradius of a triangle", () => {
    const triangle = initializeSuperTriangleVertices(20);
    const circumCenter = getCircumcenter(triangle.p1, triangle.p2, triangle.p3);

    const result = getCircumradius(circumCenter, triangle.p1);

    expect(result).toBeCloseTo(21.666);
  });

  it("should calculate circumradius of a different triangle", () => {
    const circumCenter = { x: 2, y: 2 };
    const point = { x: 0, y: 0 };

    const result = getCircumradius(circumCenter, point);

    expect(result).toBeCloseTo(2.828);
  });

  it("should calculate the same radius from all triangle vertices", () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 4, y: 0 };
    const p3 = { x: 1, y: 3 };

    const center = getCircumcenter(p1, p2, p3);

    const r1 = getCircumradius(center, p1);
    const r2 = getCircumradius(center, p2);
    const r3 = getCircumradius(center, p3);

    expect(r1).toEqual(r2);
    expect(r2).toEqual(r3);
  });
});

describe("isInsideCircumcircle", () => {
  it("should return true when point is inside of the circumcircle", () => {
    const triangle = initializeSuperTriangleVertices(20);
    const circumCenter = getCircumcenter(triangle.p1, triangle.p2, triangle.p3);
    const circumradius = getCircumradius(circumCenter, triangle.p1);

    const point = { x: 10, y: 10 };

    const result = isInsideCircumcircle(circumCenter, circumradius, point);

    expect(result).toEqual(true);
  });

  it("should return true, when point is on the circumcircle", () => {
    const triangle = initializeSuperTriangleVertices(20);
    const circumCenter = getCircumcenter(triangle.p1, triangle.p2, triangle.p3);
    const circumradius = getCircumradius(circumCenter, triangle.p1);

    const point = { x: circumCenter.x + circumradius, y: circumCenter.y };

    const result = isInsideCircumcircle(circumCenter, circumradius, point);

    expect(result).toEqual(true);
  });

  it("should return true when point is at the circumcenter", () => {
    const circumCenter = { x: 10, y: 10 };
    const circumradius = 5;

    const point = { x: 10, y: 10 };

    const result = isInsideCircumcircle(circumCenter, circumradius, point);

    expect(result).toBe(true);
  });

  it("should return false, when point is outside of the circumcircle", () => {
    const triangle = initializeSuperTriangleVertices(20);
    const circumCenter = getCircumcenter(triangle.p1, triangle.p2, triangle.p3);
    const circumradius = getCircumradius(circumCenter, triangle.p1);

    const point = { x: 32, y: 32 };

    const result = isInsideCircumcircle(circumCenter, circumradius, point);

    expect(result).toEqual(false);
  });

  it("should return false when point is slightly outside the circumcircle", () => {
    const center = { x: 0, y: 0 };
    const radius = 5;

    const point = { x: 5, y: 0.2 };

    const result = isInsideCircumcircle(center, radius, point);

    expect(result).toBe(false);
  });
});

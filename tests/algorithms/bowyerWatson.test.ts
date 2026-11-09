import { describe, expect, it } from "vitest";
import {
  doBowyerWatson,
  getCircumcenter,
  getCircumradius,
  isInsideCircumcircle,
} from "../../src/algorithms/bowyerWatson";

interface Coordinates {
  x: number;
  y: number;
}

/**
 * In computational geometry, a Delaunay triangulation or Delone triangulation of a set of points
 * in the plane subdivides their convex hull[1] into triangles whose circumcircles do not contain any of the points;
 * that is, each circumcircle has its generating points on its circumference, but all other points in the set are outside of it.
 * If the points all lie on a straight line, the notion of triangulation becomes degenerate and there is no Delaunay triangulation.
 * @source Wikipedia (Delaunay triangulation)
 */

const pointList1: Map<number, Coordinates> = new Map([
  [0, { x: 9, y: 3 }],
  [1, { x: 2, y: 7 }],
  [2, { x: 11, y: 7 }],
  [3, { x: 16, y: 14 }],
]);

describe("doBowyerWatson with a set of four points", () => {
  it("should correctly triangulate the given points", () => {
    const result = doBowyerWatson(20, pointList1);

    expect(result).toBeDefined();
    if (!result) throw new Error("Triangulation was not created");

    expect(result).toEqual(
      new Map([
        [10, [2, 1, 0]],
        [16, [3, 1, 2]],
      ]),
    );
  });

  it("triangle 10 should only contain its own points", () => {
    const triangulation = doBowyerWatson(20, pointList1);

    expect(triangulation).toBeDefined();
    if (!triangulation) throw new Error("Triangulation was not created");

    const ownPoints = triangulation.get(10);
    expect(ownPoints).toBeDefined();
    if (!ownPoints) throw new Error("Triangle 10 was not found");

    const p1 = pointList1.get(ownPoints[0]);
    const p2 = pointList1.get(ownPoints[1]);
    const p3 = pointList1.get(ownPoints[2]);

    expect(p1).toBeDefined();
    expect(p2).toBeDefined();
    expect(p3).toBeDefined();
    if (!p1 || !p2 || !p3) throw new Error("Triangle points were not found");

    const circumcenter = getCircumcenter(p1, p2, p3);
    const circumradius = getCircumradius(circumcenter, p1);

    expect(isInsideCircumcircle(circumcenter, circumradius, p1)).toBe(true);
    expect(isInsideCircumcircle(circumcenter, circumradius, p2)).toBe(true);
    expect(isInsideCircumcircle(circumcenter, circumradius, p3)).toBe(true);

    expect(isInsideCircumcircle(circumcenter, circumradius, pointList1.get(3)!)).toBe(false);
  });

  it("triangle 16 should only contain its own points", () => {
    const triangulation = doBowyerWatson(20, pointList1);

    expect(triangulation).toBeDefined();
    if (!triangulation) throw new Error("Triangulation was not created");

    const ownPoints = triangulation.get(16);
    expect(ownPoints).toBeDefined();
    if (!ownPoints) throw new Error("Triangle 16 was not found");

    const p1 = pointList1.get(ownPoints[0]);
    const p2 = pointList1.get(ownPoints[1]);
    const p3 = pointList1.get(ownPoints[2]);

    expect(p1).toBeDefined();
    expect(p2).toBeDefined();
    expect(p3).toBeDefined();
    if (!p1 || !p2 || !p3) throw new Error("Triangle points were not found");

    const circumcenter = getCircumcenter(p1, p2, p3);
    const circumradius = getCircumradius(circumcenter, p1);

    expect(isInsideCircumcircle(circumcenter, circumradius, p1)).toBe(true);
    expect(isInsideCircumcircle(circumcenter, circumradius, p2)).toBe(true);
    expect(isInsideCircumcircle(circumcenter, circumradius, p3)).toBe(true);

    expect(isInsideCircumcircle(circumcenter, circumradius, pointList1.get(0)!)).toBe(false);
  });
});

const pointList2: Map<number, Coordinates> = new Map([
  [0, { x: 7, y: 2 }],
  [1, { x: 11, y: 5 }],
  [2, { x: 15, y: 5 }],
  [3, { x: 11, y: 9 }],
]);

describe("doBowyerWatson with one point inside a triangle", () => {
  it("should correctly triangulate the given points", () => {
    const result = doBowyerWatson(20, pointList2);

    expect(result).toBeDefined();
    if (!result) throw new Error("Triangulation was not created");

    expect(result).toEqual(
      new Map([
        [8, [2, 1, 0]],
        [14, [3, 0, 1]],
        [16, [3, 1, 2]],
      ]),
    );
  });

  it("triangle 8 should only contain its own points", () => {
    const triangulation = doBowyerWatson(20, pointList2);

    expect(triangulation).toBeDefined();
    if (!triangulation) throw new Error("Triangulation was not created");

    const ownPoints = triangulation.get(8);
    expect(ownPoints).toBeDefined();
    if (!ownPoints) throw new Error("Triangle 8 was not found");

    const p1 = pointList2.get(ownPoints[0]);
    const p2 = pointList2.get(ownPoints[1]);
    const p3 = pointList2.get(ownPoints[2]);

    expect(p1).toBeDefined();
    expect(p2).toBeDefined();
    expect(p3).toBeDefined();
    if (!p1 || !p2 || !p3) throw new Error("Triangle points were not found");

    const circumcenter = getCircumcenter(p1, p2, p3);
    const circumradius = getCircumradius(circumcenter, p1);

    expect(isInsideCircumcircle(circumcenter, circumradius, p1)).toBe(true);
    expect(isInsideCircumcircle(circumcenter, circumradius, p2)).toBe(true);
    expect(isInsideCircumcircle(circumcenter, circumradius, p3)).toBe(true);

    expect(isInsideCircumcircle(circumcenter, circumradius, pointList2.get(3)!)).toBe(false);
  });

  it("triangle 14 should only contain its own points", () => {
    const triangulation = doBowyerWatson(20, pointList2);

    expect(triangulation).toBeDefined();
    if (!triangulation) throw new Error("Triangulation was not created");

    const ownPoints = triangulation.get(14);
    expect(ownPoints).toBeDefined();
    if (!ownPoints) throw new Error("Triangle 14 was not found");

    const p1 = pointList2.get(ownPoints[0]);
    const p2 = pointList2.get(ownPoints[1]);
    const p3 = pointList2.get(ownPoints[2]);

    expect(p1).toBeDefined();
    expect(p2).toBeDefined();
    expect(p3).toBeDefined();
    if (!p1 || !p2 || !p3) throw new Error("Triangle points were not found");

    const circumcenter = getCircumcenter(p1, p2, p3);
    const circumradius = getCircumradius(circumcenter, p1);

    expect(isInsideCircumcircle(circumcenter, circumradius, p1)).toBe(true);
    expect(isInsideCircumcircle(circumcenter, circumradius, p2)).toBe(true);
    expect(isInsideCircumcircle(circumcenter, circumradius, p3)).toBe(true);

    expect(isInsideCircumcircle(circumcenter, circumradius, pointList2.get(2)!)).toBe(false);
  });

  it("triangle 16 should only contain its own points", () => {
    const triangulation = doBowyerWatson(20, pointList2);

    expect(triangulation).toBeDefined();
    if (!triangulation) throw new Error("Triangulation was not created");

    const ownPoints = triangulation.get(16);
    expect(ownPoints).toBeDefined();
    if (!ownPoints) throw new Error("Triangle 16 was not found");

    const p1 = pointList2.get(ownPoints[0]);
    const p2 = pointList2.get(ownPoints[1]);
    const p3 = pointList2.get(ownPoints[2]);

    expect(p1).toBeDefined();
    expect(p2).toBeDefined();
    expect(p3).toBeDefined();
    if (!p1 || !p2 || !p3) throw new Error("Triangle points were not found");

    const circumcenter = getCircumcenter(p1, p2, p3);
    const circumradius = getCircumradius(circumcenter, p1);

    expect(isInsideCircumcircle(circumcenter, circumradius, p1)).toBe(true);
    expect(isInsideCircumcircle(circumcenter, circumradius, p2)).toBe(true);
    expect(isInsideCircumcircle(circumcenter, circumradius, p3)).toBe(true);

    expect(isInsideCircumcircle(circumcenter, circumradius, pointList2.get(0)!)).toBe(false);
  });
});

const pointList3: Map<number, Coordinates> = new Map([
  [0, { x: 2, y: 2 }],
  [1, { x: 5, y: 5 }],
  [2, { x: 8, y: 8 }],
  [3, { x: 11, y: 11 }],
]);

describe("test doBowyerWatson logic when all points lie on a straight line", () => {
  it("should return an empty triangulation", () => {
    const result = doBowyerWatson(20, pointList3);

    expect(result?.size).toBe(0);
  });
});

// Still working on this!
const pointList4: Map<number, Coordinates> = new Map([
  [0, { x: 16, y: 4 }],
  [1, { x: 3, y: 5 }],
  [2, { x: 10, y: 6 }],
  [3, { x: 5, y: 9 }],
]);

describe("ongelmatapaus", () => {
  it("ongelmatapaus", () => {
    const result = doBowyerWatson(20, pointList4);

    expect(result).toBeDefined();
    if (!result) throw new Error("Triangulation was not created");

    console.log(result);

    expect(result).toEqual(new Map([[16, [3, 1, 2]]]));
  });
});

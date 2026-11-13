import { euclideanDistance } from "../helpers/euclideanDistance";
import type { Coordinates } from "../types";
import { MinHeap } from "../helpers/minHeap";

export function prim(
  triangulation: Map<number, [number, number, number]>,
  pointList: Map<number, Coordinates>,
) {
  const triangleKeys = [...triangulation.keys()];
  const pathDistances = new MinHeap();
  const visited = new Set<number>();
  const paths = new Map<number, [number, number]>();

  visited.add(0);

  let count = 0;

  function addNeighbors(i: number) {
    const target = pointList.get(i);
    const connectedToTarget = new Set<number>();

    for (let j = 0; j < triangleKeys.length; j++) {
      const triangle = triangulation.get(triangleKeys[j]!);

      if (triangle!.includes(i)) {
        for (let p = 0; p < 3; p++) {
          if (triangle![p] !== i) {
            connectedToTarget.add(triangle![p]!);
          }
        }
      }
    }

    for (const point of connectedToTarget) {
      if (visited.has(point)) continue;

      const pointCoordinates = pointList.get(point);
      const distance = euclideanDistance(pointCoordinates!, target!);

      if (distance > 0) {
        pathDistances.add({
          points: [i, point],
          weight: distance,
        });
      }
    }
  }

  addNeighbors(0);

  while (visited.size < pointList.size) {
    const next = pathDistances.extractMin();

    if (!next) {
      return;
    }

    const [a, b] = next.points;

    if (visited.has(a) && visited.has(b)) {
      continue;
    }

    paths.set(count, next.points);
    count++;
    const newPoint = visited.has(a) ? b : a;
    visited.add(newPoint);

    addNeighbors(newPoint);
  }

  return paths;
}

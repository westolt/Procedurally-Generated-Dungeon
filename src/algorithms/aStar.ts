import { euclideanDistance } from "../helpers/euclideanDistance";
import { MinHeap } from "../helpers/minHeap";
import type { Coordinates } from "../types";
import { dungeonMap } from "./dungeon";

function findNeighbor(p: Coordinates): Coordinates[] {
  return [
    { x: p.x, y: p.y - 1 },
    { x: p.x - 1, y: p.y },
    { x: p.x + 1, y: p.y },
    { x: p.x, y: p.y + 1 },
  ];
}

function createPath(
  cameFrom: Map<string, Coordinates>,
  current: Coordinates,
  start: Coordinates,
): Coordinates[] {
  const path = [current];

  while (current.x !== start.x || current.y !== start.y) {
    const previous = cameFrom.get(`${current.x},${current.y}`);

    if (!previous) return [];

    path.push(previous);
    current = previous;
  }

  return path.reverse();
}

export function aStar(start: Coordinates, goal: Coordinates) {
  const openSet = new MinHeap();
  openSet.add({ points: [start.x, start.y], weight: 0 });

  const cameFrom = new Map<string, Coordinates>([]);

  const gCost = new Map<string, number>([[`${start.x},${start.y}`, 0]]);
  const fCost = new Map<string, number>([
    [`${start.x},${start.y}`, euclideanDistance(start, goal)],
  ]);

  while (openSet.size() !== 0) {
    const current = openSet.extractMin();

    if (!current) {
      throw new Error("Something went wrong");
    }

    if (current?.points[0] === goal.x && current?.points[1] === goal.y) {
      const path = createPath(cameFrom, { x: current.points[0], y: current.points[1] }, start);

      for (const tile of path) {
        dungeonMap![tile.y]![tile.x] = 1;
      }

      return dungeonMap;
    }

    const neighbors: Coordinates[] = findNeighbor({ x: current.points[0], y: current.points[1] });

    for (const neighbor of neighbors) {
      const tentativeGCost = gCost.get(`${current.points[0]},${current.points[1]}`)! + 1;

      let neighborCost = gCost.get(`${neighbor.x},${neighbor.y}`);

      if (neighborCost == undefined) {
        neighborCost = 9999;
      }

      if (tentativeGCost < neighborCost) {
        cameFrom.set(`${neighbor.x},${neighbor.y}`, { x: current.points[0], y: current.points[1] });
        gCost.set(`${neighbor.x},${neighbor.y}`, tentativeGCost);
        fCost.set(
          `${neighbor.x},${neighbor.y}`,
          tentativeGCost + euclideanDistance(neighbor, goal),
        );
        if (
          !openSet.includes({
            points: [neighbor.x, neighbor.y],
            weight: tentativeGCost + euclideanDistance(neighbor, goal),
          })
        ) {
          openSet.add({
            points: [neighbor.x, neighbor.y],
            weight: tentativeGCost + euclideanDistance(neighbor, goal),
          });
        }
      }
    }
  }
  return;
}

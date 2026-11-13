import type { Coordinates } from "../types";

export function euclideanDistance(n: Coordinates, goal: Coordinates): number {
  return Math.sqrt((goal.x - n.x) ** 2 + (goal.y - n.y) ** 2);
}

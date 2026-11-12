import { dungeonMap } from "./dungeon";

interface Coordinates {
  x: number;
  y: number;
}

interface Node {
  location: Coordinates;
  fCost: number;
}

function siftUp(nodes: Node[]) {
  let nodeIndex = nodes.length - 1;
  const node = nodes[nodeIndex];

  if (!node) {
    throw new Error("Error finding newest node in heapifyUp");
  }

  if (nodeIndex === 0) return;

  while (true) {
    const parentIndex = Math.floor((nodeIndex - 1) / 2);

    if (parentIndex < 0) {
      return;
    }

    const parent = nodes[parentIndex];

    if (!parent) {
      throw new Error("Error finding parent in heapifyUp");
    }

    if (node.fCost < parent.fCost) {
      nodes[parentIndex] = node;
      nodes[nodeIndex] = parent;
      nodeIndex = parentIndex;
    } else {
      break;
    }
  }
}

function siftDown(nodes: Node[]) {
  const node = nodes[nodes.length - 1];
  let nodeIndex = 0;

  if (!node) throw new Error("Did not find the node value in sifhtDown");

  nodes[0] = node;
  nodes.pop();

  while (true) {
    let targetIndex;
    let target: Node;
    const leftIndex = 2 * nodeIndex + 1;
    const left = nodes[leftIndex];
    const rightIndex = 2 * nodeIndex + 2;
    const right = nodes[rightIndex];

    if (!left && right) {
      target = right;
      targetIndex = rightIndex;
    } else if (left && !right) {
      target = left;
      targetIndex = leftIndex;
    } else if (!left && !right) {
      return;
    } else {
      target = left!.fCost < right!.fCost ? left! : right!;
      targetIndex = target === left ? leftIndex : rightIndex;
    }

    if (target.fCost < node.fCost) {
      nodes[nodeIndex] = target;
      nodes[targetIndex] = node;
      nodeIndex = targetIndex;
    } else {
      break;
    }
  }
}

class MinHeap {
  private nodes: Node[] = [];

  add(node: Node) {
    this.nodes.push(node);
    siftUp(this.nodes);
  }

  extractMin() {
    if (this.nodes.length === 0) throw new Error("Heap empty");

    const min = this.nodes[0];

    if (this.nodes.length > 1) {
      siftDown(this.nodes);
    } else {
      this.nodes.shift();
    }

    return min;
  }

  includes(node: Node) {
    return this.nodes.some(
      (n) => n.location.x === node.location.x && n.location.y === node.location.y,
    );
  }

  size() {
    return this.nodes.length;
  }
}

function h(n: Coordinates, goal: Coordinates): number {
  return Math.sqrt((goal.x - n.x) ** 2 + (goal.y - n.y) ** 2);
}

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
  openSet.add({ location: start, fCost: 0 });

  const cameFrom = new Map<string, Coordinates>([]);

  const gCost = new Map<string, number>([[`${start.x},${start.y}`, 0]]);
  const fCost = new Map<string, number>([[`${start.x},${start.y}`, h(start, goal)]]);

  while (openSet.size() !== 0) {
    const current = openSet.extractMin();

    if (!current) {
      throw new Error("Something went wrong");
    }

    if (current?.location.x === goal.x && current?.location.y === goal.y) {
      const path = createPath(cameFrom, current.location, start);

      for (const tile of path) {
        dungeonMap![tile.y]![tile.x] = 1;
      }

      return dungeonMap;
    }

    const neighbors: Coordinates[] = findNeighbor(current.location);

    for (const neighbor of neighbors) {
      const tentativeGCost = gCost.get(`${current.location.x},${current.location.y}`)! + 1;

      let neighborCost = gCost.get(`${neighbor.x},${neighbor.y}`);

      if (neighborCost == undefined) {
        neighborCost = 9999;
      }

      if (tentativeGCost < neighborCost) {
        cameFrom.set(`${neighbor.x},${neighbor.y}`, current.location);
        gCost.set(`${neighbor.x},${neighbor.y}`, tentativeGCost);
        fCost.set(`${neighbor.x},${neighbor.y}`, tentativeGCost + h(neighbor, goal));
        if (!openSet.includes({ location: neighbor, fCost: tentativeGCost + h(neighbor, goal) })) {
          openSet.add({ location: neighbor, fCost: tentativeGCost + h(neighbor, goal) });
        }
      }
    }
  }
  return;
}

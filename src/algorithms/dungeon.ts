import { aStar } from "./aStar";
import { doBowyerWatson } from "./bowyerWatson";

type DungeonValue = 0 | 1;

type ValidNumberOfRooms = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface DungeonType {
  size: 20;
  numberOfRooms: ValidNumberOfRooms;
}

// Configuration for dungeon generation
export const info: DungeonType = {
  size: 20,
  numberOfRooms: 4,
};

export const dungeonMap: Array<Array<DungeonValue>> = [];

interface Coordinates {
  x: number;
  y: number;
}

export const pointList = new Map<number, Coordinates>();

/**
 * Builds a 3x3 room at the given coordinates.
 *
 * @param i The starting row of the room.
 * @param j The starting column of the room.
 */
function buildRoom(i: number, j: number, roomsNeeded: number) {
  let countRow = 0;

  for (let y = i; y < i + 3; y++) {
    let countPos = 0;
    for (let x = j; x < j + 3; x++) {
      dungeonMap[y]![x] = 1;

      // Find thet center of the room and add it to the pointList
      if (countRow === 1 && countPos === 1) {
        pointList.set(info.numberOfRooms - roomsNeeded, { x: x, y: y });
      }

      countPos++;
    }
    countRow++;
  }
}

/**
 * Checks whether the 5x5 area around the room's starting position
 * is empty ensuring at least one empty tile around the room.
 *
 * @param i The starting row of the room.
 * @param j The starting column of the room.
 * @returns True if the area is empty, otherwise false.
 */
function isAreaEmpty(i: number, j: number): boolean {
  const startY = i - 1;
  const startX = j - 1;

  for (let y = startY; y < startY + 5; y++) {
    for (let x = startX; x < startX + 5; x++) {
      if (dungeonMap[y]![x] === 1) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Generates a dungeon map containing the configured number of rooms.
 *
 * @returns A two-dimensional array representing the generated dungeon.
 *          0 represents an empty tile and 1 represents a room tile.
 */
export function generateDungeonMap() {
  pointList.clear();
  dungeonMap.length = 0;

  // Initialize map with zeros
  for (let i = 0; i < info.size; i++) {
    dungeonMap.push([]);
    for (let j = 0; j < info.size; j++) {
      dungeonMap[i]!.push(0);
    }
  }

  let roomsNeeded = info.numberOfRooms;

  // Pick random positions for rooms
  while (roomsNeeded > 0) {
    let totalWeight = 200;

    // Keep a one tile border and ensure rooms fit within the map.
    for (let i = 1; i < info.size - 3; i++) {
      for (let j = 1; j < info.size - 3; j++) {
        if (dungeonMap[i]![j] !== 1) {
          // The chance of building is (10 / totalWeight) each time
          const buildingChance = 10;
          const random = Math.floor(Math.random() * totalWeight);
          if (buildingChance > random) {
            const isEmpty = isAreaEmpty(i, j);
            if (isEmpty) {
              buildRoom(i, j, roomsNeeded);
              roomsNeeded--;
            }
          }
        }

        if (roomsNeeded == 0) break;
      }
      if (roomsNeeded == 0) break;

      // Make the odds of building slightly better before moving to the next row
      totalWeight -= 5;
    }
  }

  console.log("pointList: ", pointList);

  const triangulation = doBowyerWatson(info.size, pointList);
  console.log("triangulation: ", triangulation);

  if (triangulation) {
    for (const triangle of triangulation.values()) {
      if (!triangle) return;
      for (let i = 0; i < 3; i++) {
        const start: Coordinates = pointList.get(triangle[i]!)!;
        const goal: Coordinates =
          i === 2 ? pointList.get(triangle[0])! : pointList.get(triangle[i + 1]!)!;
        if (!start || !goal) return;
        aStar(start, goal);
      }
    }
  }

  console.log(dungeonMap);

  return dungeonMap;
}

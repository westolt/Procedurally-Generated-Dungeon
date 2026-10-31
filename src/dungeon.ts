type DungeonValue = 0 | 1;

export type DungeonRow = [
  DungeonValue,
  DungeonValue,
  DungeonValue,
  DungeonValue,
  DungeonValue,
  DungeonValue,
  DungeonValue,
  DungeonValue,
  DungeonValue,
  DungeonValue,
];

type DungeonType = [
  DungeonRow,
  DungeonRow,
  DungeonRow,
  DungeonRow,
  DungeonRow,
  DungeonRow,
  DungeonRow,
  DungeonRow,
  DungeonRow,
  DungeonRow,
];

export const dungeon: DungeonType = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

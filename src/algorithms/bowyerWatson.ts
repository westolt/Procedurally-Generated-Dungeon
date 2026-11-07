interface Coordinates {
  x: number;
  y: number;
}

interface SuperTriangle {
  p1: Coordinates;
  p2: Coordinates;
  p3: Coordinates;
}

/**
 * Initializes a super triangle.
 *
 * @param size The size of the dungeon map.
 * @returns A super triangle containing three vertices.
 */
export function initializeSuperTriangleVertices(size: number): SuperTriangle {
  const superT: SuperTriangle = {
    p1: { x: size / 2, y: -(size / 2) },
    p2: { x: size + size / 2, y: size },
    p3: { x: -(size / 2), y: size },
  };

  return superT;
}

/**
 * Calculates the circumcenter of a triangle defined by three points.
 *
 * @param p1 The first vertex of the triangle.
 * @param p2 The second vertex of the triangle.
 * @param p3 The third vertex of the triangle.
 * @returns The coordinates of the triangle's circumcenter.
 */
function getCircumcenter(p1: Coordinates, p2: Coordinates, p3: Coordinates) {
  const D = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));

  const Ux =
    (p1.x ** 2 + p1.y ** 2) * (p2.y - p3.y) +
    (p2.x ** 2 + p2.y ** 2) * (p3.y - p1.y) +
    (p3.x ** 2 + p3.y ** 2) * (p1.y - p2.y);

  const Uy =
    (p1.x ** 2 + p1.y ** 2) * (p3.x - p2.x) +
    (p2.x ** 2 + p2.y ** 2) * (p1.x - p3.x) +
    (p3.x ** 2 + p3.y ** 2) * (p2.x - p1.x);

  return { x: Ux / D, y: Uy / D };
}

/**
 * Calculates the radius of a triangle's circumcircle.
 *
 * @param circumCenter The center coordinates of the circumcircle.
 * @param p The coordinates of one of the triangle's vertices.
 * @returns The radius of the circumcircle.
 */
function getCircumradius(circumCenter: Coordinates, p: Coordinates) {
  return Math.sqrt((circumCenter.x - p.x) ** 2 + (circumCenter.y - p.y) ** 2);
}

/**
 * Checks whether a given point is inside of a circumcircle.
 *
 * @param circumCenter The center coordinates of the circumcircle.
 * @param circumradius The radius of the circumcircle.
 * @param p The point to check.
 * @returns True if the point is inside or on the circumcircle, otherwise false.
 */
function isInsideCircumcircle(
  circumCenter: Coordinates,
  circumradius: number,
  p: Coordinates,
): boolean {
  const dx = circumCenter.x - p.x;
  const dy = circumCenter.y - p.y;

  return dx ** 2 + dy ** 2 <= circumradius ** 2;
}

/**
 * Does Delaunay triangulation using the Bowyer-Watson algorithm.
 *
 * @param dungeonSize The size of the dungeon map.
 * @param pointList A map containing the keys and coordinates of the points.
 * @returns The triangulation.
 */
export function doBowyerWatson(dungeonSize: number, pointList: Map<number, Coordinates>) {
  const triangulation = new Map<number, [number, number, number]>();

  let nextTriangleId = 0;

  function addTriangle(p1: number, p2: number, p3: number) {
    triangulation.set(nextTriangleId, [p1, p2, p3]);
    nextTriangleId++;
  }

  function removeTriangle(triangle: number) {
    triangulation.delete(triangle);
  }

  // Create the vertices of the super triangle
  const superT = initializeSuperTriangleVertices(dungeonSize);

  const lastKey = Math.max(-1, ...pointList.keys());

  // Create a copy of the pointList that holds the information of all the point coordinates including super triangle points
  const pointListC = new Map([...pointList]);

  // Add super triangle's vertix coordinates to pointLis copy
  pointListC.set(lastKey! + 1, superT.p1);
  pointListC.set(lastKey! + 2, superT.p2);
  pointListC.set(lastKey! + 3, superT.p3);

  // Add the super triangle to triangulation
  addTriangle(lastKey! + 1, lastKey! + 2, lastKey! + 3);

  // Add all the points one at a time to the triangulation
  for (const [key, value] of pointList) {
    const pointId = key;
    const currentPoint: Coordinates = value;

    const badTriangles = new Set<number>();

    // Find all triangles whose circumcircles contain the inserted point (bad triangles)
    for (const [key, value] of triangulation) {
      const p1 = pointListC.get(value[0]!);
      const p2 = pointListC.get(value[1]!);
      const p3 = pointListC.get(value[2]!);
      const circumCenter = getCircumcenter(p1!, p2!, p3!);

      if (!circumCenter) continue;
      const circumradius = getCircumradius(circumCenter, p1!);

      const isInside = isInsideCircumcircle(circumCenter, circumradius, currentPoint);

      if (isInside) {
        badTriangles.add(key);
      }
    }

    // Find edges that are not shared between bad triangles
    const polygon = new Set<[number, number]>();

    for (const triangle of badTriangles) {
      const target = triangulation.get(triangle);
      if (!target) continue;

      // Go through all three edges of the current triangle
      for (let i = 0; i < 3; i++) {
        const a: number = target[i]!;
        const b: number = i === 2 ? target[0] : target[i + 1]!;
        const edge: [number, number] = [a, b];

        let isShared = false;

        // Check if the edge is shared with another bad triangle
        for (const otherTriangle of badTriangles) {
          if (otherTriangle === triangle) continue;
          const compare = triangulation.get(otherTriangle);
          const a = compare?.[0];
          const b = compare?.[1];
          const c = compare?.[2];
          if ((edge[0] == a && edge[1] == b) || (edge[1] == a && edge[0] == b)) {
            isShared = true;
            break;
          } else if ((edge[0] == b && edge[1] == c) || (edge[1] == c && edge[0] == b)) {
            isShared = true;
            break;
          } else if ((edge[0] == c && edge[1] == a) || (edge[1] == a && edge[0] == c)) {
            isShared = true;
            break;
          }
        }

        // Add the edge to the polygon if it is not shared with another bad triangle
        if (isShared == false) {
          polygon.add(edge);
        }
      }
    }

    // Remove all bad triangles from the triangulation
    for (const triangle of badTriangles) {
      removeTriangle(triangle);
    }

    // Update triangulation
    for (const edge of polygon) {
      addTriangle(pointId, edge[0], edge[1]);
    }
  }

  // Remove triangles that contain vertices of the super triangle
  for (const [key, value] of triangulation) {
    for (let i = 1; i < 4; i++) {
      if (value.includes(lastKey! + i)) {
        removeTriangle(key);
      }
    }
  }

  return triangulation;
}

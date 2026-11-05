interface Coordinates {
  x: number;
  y: number;
}

interface SuperTriangle {
  p1: Coordinates;
  p2: Coordinates;
  p3: Coordinates;
}

// Vertices of the super triangle
let superT: SuperTriangle = {
  // Top vertix
  p1: { x: 0, y: 0 },
  // Right vertix
  p2: { x: 0, y: 0 },
  // Left vertix
  p3: { x: 0, y: 0 },
};

// Super triangle circumcenter
let superCircumcenter: Coordinates = { x: 0, y: 0 };

// Super triangle radius
let superCircumradius = 0;

export function initializeSuperTriangle(size: number) {
  superT.p1.x = size / 2;
  superT.p1.y = -(size / 2);

  superT.p2.x = size + size / 2;
  superT.p2.y = size;

  superT.p3.x = -(size / 2);
  superT.p3.y = size;

  superCircumcenter = getCircumcenter(superT.p1, superT.p2, superT.p3);

  superCircumradius = getCircumradius(superCircumcenter, superT.p1);

  console.log(
    `Circumcenter x: ${superCircumcenter.x}\n Circumcenter y: ${superCircumcenter.y}\n Radius: ${superCircumradius}`,
  );
}

function getCircumcenter(p1: Coordinates, p2: Coordinates, p3: Coordinates) {
  const D =
    2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
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

function getCircumradius(circumCenter: Coordinates, p: Coordinates) {
  return Math.sqrt((circumCenter.x - p.x) ** 2 + (circumCenter.y - p.y) ** 2);
}

function isInsideCircumcircle(
  circumCenter: Coordinates,
  circumradius: number,
  p: Coordinates,
): boolean {
  const dx = circumCenter.x - p.x;
  const dy = circumCenter.y - p.y;

  return dx ** 2 + dy ** 2 <= circumradius ** 2;
}

export function doBowyerWatson(roomCenter: Coordinates) {
  const isInside = isInsideCircumcircle(
    superCircumcenter,
    superCircumradius,
    roomCenter,
  );
  if (isInside) {
    console.log("Is inside!");
  } else {
    console.log("Is not inside!");
  }
}

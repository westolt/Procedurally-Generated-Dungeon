interface Value {
  points: [number, number];
  weight: number;
}

function siftUp(values: Value[]) {
  let valueIndex = values.length - 1;
  const value = values[valueIndex];

  if (!value) {
    throw new Error("Error finding newest value in heapifyUp");
  }

  if (valueIndex === 0) return;

  while (true) {
    const parentIndex = Math.floor((valueIndex - 1) / 2);

    if (parentIndex < 0) {
      return;
    }

    const parent = values[parentIndex];

    if (!parent) {
      throw new Error("Error finding parent in heapifyUp");
    }

    if (value.weight < parent.weight) {
      values[parentIndex] = value;
      values[valueIndex] = parent;
      valueIndex = parentIndex;
    } else {
      break;
    }
  }
}

function siftDown(values: Value[]) {
  const value = values[values.length - 1];
  let valueIndex = 0;

  if (!value) throw new Error("Did not find the value value in sifhtDown");

  values[0] = value;
  values.pop();

  while (true) {
    let targetIndex;
    let target: Value;
    const leftIndex = 2 * valueIndex + 1;
    const left = values[leftIndex];
    const rightIndex = 2 * valueIndex + 2;
    const right = values[rightIndex];

    if (!left && right) {
      target = right;
      targetIndex = rightIndex;
    } else if (left && !right) {
      target = left;
      targetIndex = leftIndex;
    } else if (!left && !right) {
      return;
    } else {
      target = left!.weight < right!.weight ? left! : right!;
      targetIndex = target === left ? leftIndex : rightIndex;
    }

    if (target.weight < value.weight) {
      values[valueIndex] = target;
      values[targetIndex] = value;
      valueIndex = targetIndex;
    } else {
      break;
    }
  }
}

export class MinHeap {
  private values: Value[] = [];

  add(value: Value) {
    this.values.push(value);
    siftUp(this.values);
  }

  extractMin() {
    if (this.values.length === 0) throw new Error("Heap empty");

    const min = this.values[0];

    if (this.values.length > 1) {
      siftDown(this.values);
    } else {
      this.values.shift();
    }

    return min;
  }

  includes(value: Value) {
    return this.values.some(
      (n) => n.points[0] === value.points[0] && n.points[1] === value.points[1],
    );
  }

  size() {
    return this.values.length;
  }
}

export function* chunk<T>(size: number, items: Iterable<T>) {
  let i = 0;
  let arr = [];
  arr.length = size;

  for (let item of items) {
    arr[i] = item;

    if (++i === size) {
      yield arr;
      arr = [];
      arr.length = size;
      i = 0;
    }
  }

  if (i !== 0 && i < size) {
    arr.length = i
    yield arr;
  }
}

export function findSibling(element: HTMLElement, selector: string) {
  let sibling = element?.nextElementSibling;
  while (sibling != null) {
    if (sibling.matches(selector)) {
      return sibling as HTMLElement;
    }
    sibling = sibling.nextElementSibling;
  }
  return null;
}

export function findPreviousSibling(element: HTMLElement, selector: string) {
  let previous = element?.previousElementSibling;
  while (previous != null) {
    if (previous.matches(selector)) {
      return previous as HTMLElement;
    }
    previous = previous.previousElementSibling;
  }
  return null;
}

export function first<T>(items: Iterable<T>): T | null {
  for (const i of items) {
    return i;
  }
  return null;
}
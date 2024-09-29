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
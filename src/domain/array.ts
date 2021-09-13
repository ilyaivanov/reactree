export const updateLastItem = <T>(arr: T[], update: (v: T) => T): T[] =>
  updateArrayAtIndex(arr, lastItemIndex(arr), update);

export const updateArrayAtIndex = <T>(
  arr: T[],
  index: number,
  update: (v: T) => T
): T[] => {
  const newArray = [...arr];
  newArray[index] = update(arr[index]);
  return newArray;
};

export const shift = <T>(arr: T[]): [T, T[]] => [arr[0], arr.slice(1)];

export const pop = <T>(arr: T[]): [T[], T] => [
  removeLast(arr),
  arr[arr.length - 1],
];

export const removeLast = <T>(arr: T[]): T[] => arr.slice(0, arr.length - 1);

export const lastItemIndex = (arr: unknown[]): number => arr.length - 1;
export const lastItem = <T>(arr: T[]): T => arr[arr.length - 1];

export const insertAt = <T>(arr: T[], index: number, item: T): T[] => {
  console.log("insertAt");
  const copy = [...arr];
  copy.splice(index, 0, item);
  return copy;
};

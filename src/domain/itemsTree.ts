export const createItem = (title: string, children?: Item[]): Item => {
  const item: Item = {
    id: "id_" + Math.random(),
    title,
    isOpen: children ? children.length > 0 : false,
    children: children || [],
  };

  children && children.forEach((child) => (child.parent = item));
  return item;
};

export const getItemOffsetFromParent = (item: Item) => {
  if (!item.parent) return 0;
  else {
    const getChildrenCountIncludingSelf = (item: Item): number => {
      if (item.isOpen)
        return 1 + sumBy(item.children, getChildrenCountIncludingSelf);
      else return 1;
    };
    const context = item.parent.children;
    const index = context.indexOf(item);
    return 1 + sumBy(context.slice(0, index), getChildrenCountIncludingSelf);
  }
};

export type Path = number[];

export const getItemAtPath = (root: Item, path: Path): Item => {
  let item = root;

  path.forEach((index, pathElementIndex) => {
    const nextItem = item.children[index];

    if (!nextItem) throwPathLookupError(path, item, pathElementIndex);

    item = nextItem;
  });

  return item;
};
export const updateItemByPath = (
  root: Item,
  path: Path,
  update: (item: Item) => Item
): Item => {
  const updateAt = (currentItem: Item, remainingPath: Path): Item => {
    if (remainingPath.length === 0) return update(currentItem);
    else {
      const [nextIndex, otherPath] = shift(remainingPath);
      return currentItem.children[nextIndex]
        ? updateItemChildAt(currentItem, nextIndex, (i) =>
            updateAt(i, otherPath)
          )
        : throwPathLookupError(
            path,
            currentItem,
            path.length - remainingPath.length
          );
    }
  };
  return updateAt(root, path);
};

export const getPathPositionFromRoot = (root: Item, path: Path) => {
  let currentPath = [];
  let offset = 0;
  while (currentPath.length !== path.length) {
    currentPath.push(path[currentPath.length]);
    offset += getItemOffsetFromParent(getItemAtPath(root, currentPath));
  }
  return offset;
};

export const getItemBelow = (root: Item, path: Path): Path => {
  const item = getItemAtPath(root, path);
  if (item.isOpen) return [...path, 0];
  else {
    let nonLastParent = path;
    while (isLastItem(root, nonLastParent)) {
      nonLastParent = removeLast(nonLastParent);
    }

    if (nonLastParent.length === 0) return path;

    return updateLastItem(nonLastParent, (a) => a + 1);
  }
};

export const getItemAbove = (root: Item, path: Path): Path => {
  if (path.length === 0) return [];

  if (path.length === 1 && path[0] === 0) return [];

  if (isFirstItem(path)) return removeLast(path);

  const previousSiblingPath = updateLastItem(path, (a) => a - 1);
  return getLastNestedItem(root, previousSiblingPath);
};

//item utils

const isLastItem = (root: Item, path: Path): boolean => {
  const [rest, lastItem] = pop(path);
  const item = getItemAtPath(root, rest);
  return lastItemIndex(item.children) === lastItem;
};

export const getLastNestedItem = (root: Item, path: Path): Path => {
  const item = getItemAtPath(root, path);
  if (item.isOpen)
    return getLastNestedItem(root, [...path, lastItemIndex(item.children)]);
  else return path;
};

const isFirstItem = (path: Path): boolean => path[path.length - 1] === 0;

const updateItemChildAt = (
  item: Item,
  index: number,
  updater: (i: Item) => Item
) => ({
  ...item,
  children: updateArrayAtIndex(item.children, index, updater),
});

//Array utils
const updateLastItem = <T>(arr: T[], update: (v: T) => T): T[] =>
  updateArrayAtIndex(arr, lastItemIndex(arr), update);

const updateArrayAtIndex = <T>(
  arr: T[],
  index: number,
  update: (v: T) => T
): T[] => {
  const newArray = [...arr];
  newArray[index] = update(arr[index]);
  return newArray;
};

//non-mutative array ops
const shift = <T>(arr: T[]): [T, T[]] => [arr[0], arr.slice(1)];

const pop = <T>(arr: T[]): [T[], T] => [removeLast(arr), arr[arr.length - 1]];

const removeLast = <T>(arr: T[]): T[] => arr.slice(0, arr.length - 1);

const lastItemIndex = (arr: unknown[]): number => arr.length - 1;

//Error handling
const throwPathLookupError = (
  path: Path,
  brokeAt: Item,
  brokeAtIndex: number
): never => {
  const separator = ", ";
  const pathF = `[${path.join(separator)}]`;

  const pathElementLength = (pathElem: number) =>
    numberLength(pathElem) + separator.length;

  const startHighlightAt =
    sumBy(path.slice(0, brokeAtIndex), pathElementLength) + 1;
  const highlightLength = numberLength(path[brokeAtIndex]);

  const firstLine = `Invalid path. Can't find element at ${pathF}. Broke at:
${pathF}
${highlight(startHighlightAt, highlightLength)}
Check children of an item ${brokeAt.title}`;
  throw new Error(firstLine);
};

const highlight = (whitespaces: number, highlight: number) =>
  " ".repeat(whitespaces) + "^".repeat(highlight);

const numberLength = (num: number) => num.toString().length;

const sumBy = <T>(numbers: T[], mapper: (val: T) => number): number =>
  numbers.reduce((acc, val) => acc + mapper(val), 0);

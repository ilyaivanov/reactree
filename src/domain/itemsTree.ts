import * as array from "./array";
import { randomInt } from "./number";

export const createItem = (title: string, children?: Item[]): Item => ({
  id: "id_" + Math.random(),
  title,
  isOpen: children ? children.length > 0 : false,
  children: children || [],
});

export const createNewItem = (): Item => ({
  id: "rid_" + Math.random(),
  title: "",
  children: [],
  isOpen: false,
  isEditing: true,
});

export const getItemOffsetFromParent = (parent: Item, item: Item) => {
  const getChildrenCountIncludingSelf = (child: Item): number => {
    if (child.isOpen)
      return 1 + sumBy(child.children, getChildrenCountIncludingSelf);
    else return 1;
  };
  const context = parent.children;
  const index = context.indexOf(item);
  return 1 + sumBy(context.slice(0, index), getChildrenCountIncludingSelf);
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
      const [nextIndex, otherPath] = array.shift(remainingPath);
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
  let parent = root;
  while (currentPath.length !== path.length) {
    currentPath.push(path[currentPath.length]);
    const item = getItemAtPath(root, currentPath);
    offset += getItemOffsetFromParent(parent, item);
    parent = item;
  }
  return offset;
};

export const getItemBelow = (root: Item, path: Path): Path => {
  const item = getItemAtPath(root, path);
  if (item.isOpen) return [...path, 0];
  else {
    let nonLastParent = path;
    while (isLastItem(root, nonLastParent)) {
      nonLastParent = array.removeLast(nonLastParent);
    }

    if (isPathRoot(nonLastParent)) return path;

    return array.updateLastItem(nonLastParent, (a) => a + 1);
  }
};

export const getItemAbove = (root: Item, path: Path): Path => {
  if (isPathRoot(path)) return [];

  if (path.length === 1 && path[0] === 0) return [];

  if (isFirstItem(path)) return array.removeLast(path);

  const previousSiblingPath = array.updateLastItem(path, (a) => a - 1);
  return getLastNestedItem(root, previousSiblingPath);
};

export const closeItem = (item: Item): Item => ({
  ...item,
  isOpen: false,
});

export const openItem = (item: Item): Item => ({
  ...item,
  isOpen: true,
});

export const getPathParent = (path: Path): Path => {
  if (isPathRoot(path)) return path;
  else return array.removeLast(path);
};

//item utils

export const isPathRoot = (path: Path) => path.length === 0;

export const forEachVisibleChild = (
  item: Item,
  action: (child: Item) => void
) => {
  if (item.isOpen) {
    item.children.forEach((i) => {
      action(i);
      forEachVisibleChild(i, action);
    });
  }
};

export const randomItems = (): Item[] =>
  Array.from(new Array(randomInt(5, 20))).map((_, i) => ({
    id: "rid_" + Math.random(),
    title: "Random Item " + (i + 1),
    children: [],
    isOpen: false,
  }));

const isLastItem = (root: Item, path: Path): boolean => {
  const [rest, lastItem] = array.pop(path);
  const item = getItemAtPath(root, rest);
  return array.lastItemIndex(item.children) === lastItem;
};

const getLastNestedItem = (root: Item, path: Path): Path => {
  const item = getItemAtPath(root, path);
  if (item.isOpen)
    return getLastNestedItem(root, [
      ...path,
      array.lastItemIndex(item.children),
    ]);
  else return path;
};

const isFirstItem = (path: Path): boolean => path[path.length - 1] === 0;

const updateItemChildAt = (
  item: Item,
  index: number,
  updater: (i: Item) => Item
) => ({
  ...item,
  children: array.updateArrayAtIndex(item.children, index, updater),
});

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

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
        return item.children.reduce(
          (count, item) => count + getChildrenCountIncludingSelf(item),
          1
        );
      else return 1;
    };
    const context = item.parent.children;
    const index = context.indexOf(item);
    return (
      1 +
      context
        .slice(0, index)
        .reduce((count, item) => count + getChildrenCountIncludingSelf(item), 0)
    );
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
  while (currentPath.length != path.length) {
    currentPath.push(path[currentPath.length]);
    offset += getItemOffsetFromParent(getItemAtPath(root, currentPath));
  }
  return offset;
};

//item utils

const updateItemChildAt = (
  item: Item,
  index: number,
  updater: (i: Item) => Item
) => ({
  ...item,
  children: updateArrayAtIndex(item.children, index, updater),
});

//Array utils
const updateArrayAtIndex = <T>(
  arr: T[],
  index: number,
  update: (v: T) => T
): T[] => {
  const newArray = [...arr];
  newArray[index] = update(arr[index]);
  return newArray;
};

//non-mutative shift
const shift = <T>(arr: T[]): [T, T[]] => [arr[0], arr.slice(1)];

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

import * as tree from "./itemsTree";
import { array } from "./primitives";

export const removeSelectedItem = (state: AppState): AppState => {
  if (tree.isPathRoot(state.path)) return state;
  const item = tree.getItemAtPath(state.root, state.path);
  const parentPath = tree.getPathParent(state.path);
  return {
    root: tree.updateItemByPath(state.root, parentPath, (i) => ({
      ...i,
      children: i.children.filter((child) => child !== item),
    })),
    path: tree.getItemAbove(state.root, state.path),
  };
};

export const createNewItem = (state: AppState): AppState => {
  //TODO: write tests for this
  if (tree.isPathRoot(state.path)) {
    const nextPath = [0];
    const parentPath: Path = [];
    const newItem = tree.createNewItem();
    return {
      root: tree.updateItemByPath(state.root, parentPath, (i) => ({
        ...i,
        isOpen: true,
        children: [newItem].concat(i.children),
      })),
      path: nextPath,
    };
  }

  const itemIndex = array.lastItem(state.path);
  const nextPath = array.updateLastItem(state.path, (p) => p + 1);
  const parentPath = tree.getPathParent(state.path);
  const newItem = tree.createNewItem();
  return {
    root: tree.updateItemByPath(state.root, parentPath, (i) => ({
      ...i,
      children: array.insertAt(i.children, itemIndex + 1, newItem),
    })),
    path: nextPath,
  };
};

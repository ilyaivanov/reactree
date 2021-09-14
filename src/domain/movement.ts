import * as tree from "./itemsTree";
import { array } from "./primitives";
import { removeSelectedItem } from "./createRemoveRename";

export const moveItemRight = (state: AppState): AppState => {
  if (array.lastItem(state.path) !== 0) {
    const item = tree.getItemAtPath(state.root, state.path);
    const preivousItemPath = array.updateLastItem(state.path, (a) => a - 1);
    const previousItem = tree.getItemAtPath(state.root, preivousItemPath);
    const removed = removeSelectedItem(state).root;
    return {
      root: tree.updateItemByPath(removed, preivousItemPath, (i) =>
        tree.openItem(tree.appendChild(i, item))
      ),
      path: preivousItemPath.concat(previousItem.children.length),
    };
  }

  return state;
};

export const moveItemLeft = (state: AppState): AppState => {
  if (state.path.length > 1) {
    const item = tree.getItemAtPath(state.root, state.path);
    const parentItemPath = array.removeLast(state.path);
    const parentOfParentPath = array.removeLast(parentItemPath);
    const removed = removeSelectedItem(state).root;
    //place after the parent
    let newroot = tree.updateItemChildren(
      removed,
      parentOfParentPath,
      (children) =>
        array.insertAt(children, array.lastItem(parentItemPath) + 1, item)
    );

    if (tree.getItemAtPath(newroot, parentItemPath).children.length === 0) {
      newroot = tree.updateItemByPath(newroot, parentItemPath, tree.closeItem);
    }
    return {
      root: newroot,
      path: array.updateLastItem(parentItemPath, (a) => a + 1),
    };
  }

  return state;
};

export const moveItemDown = (state: AppState): AppState => {
  const parentPath = array.removeLast(state.path);
  const parent = tree.getItemAtPath(state.root, parentPath);
  if (parent.children.length > array.lastItem(state.path) + 1) {
    const item = tree.getItemAtPath(state.root, state.path);
    const removed = removeSelectedItem(state).root;
    return {
      root: tree.updateItemChildren(removed, parentPath, (children) =>
        array.insertAt(children, array.lastItem(state.path) + 1, item)
      ),
      path: array.updateLastItem(state.path, (a) => a + 1),
    };
  }

  return state;
};

export const moveItemUp = (state: AppState): AppState => {
  const parentPath = array.removeLast(state.path);
  if (array.lastItem(state.path) > 0) {
    const item = tree.getItemAtPath(state.root, state.path);
    const removed = removeSelectedItem(state).root;
    return {
      root: tree.updateItemChildren(removed, parentPath, (children) =>
        array.insertAt(children, array.lastItem(state.path) - 1, item)
      ),
      path: array.updateLastItem(state.path, (a) => a - 1),
    };
  }

  return state;
};

import * as tree from "./itemsTree";
import { array } from "./primitives";
import * as selection from "./selection";

//Fix removal and creation via usage of selection
export const removeSelectedItemAnsSelectPrevious = (
  state: AppState
): AppState => {
  if (tree.isPathRoot(state.path)) return state;
  const parentPath = tree.getItemAbove(state.root, state.path);
  return pipe2(selectItem(parentPath), removeItemAt(state.path), state);
};

//experimenting with functional composition
export const removeSelectedItem = (state: AppState): AppState =>
  removeItemAt(state.path)(state);

export const createNewItem = (state: AppState): AppState => {
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

  const s1 = selection.unselectAt(state.path)(state);
  const newRoot = tree.updateItemByPath(s1.root, parentPath, (i) => ({
    ...i,
    children: array.insertAt(i.children, itemIndex + 1, newItem),
  }));
  const s2 = selection.selectAt(nextPath)({ root: newRoot, path: nextPath });
  return s2;
};

const removeItemAt =
  (path: Path) =>
  (state: AppState): AppState => {
    const item = tree.getItemAtPath(state.root, path);
    const parentPath = tree.getPathParent(path);
    return {
      ...state,
      root: tree.updateItemByPath(state.root, parentPath, (i) => ({
        ...i,
        children: i.children.filter((child) => child !== item),
      })),
    };
  };

const selectItem =
  (path: Path) =>
  (state: AppState): AppState =>
    selection.changeSelection(state, path);

const pipe2 = <T>(fn1: Func1<T, T>, fn2: Func1<T, T>, arg: T): T =>
  fn2(fn1(arg));

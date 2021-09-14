import * as tree from "./itemsTree";

export const removeSelectedItem = (state: AppState): AppState => {
  if (tree.isPathRoot(state.path)) return state;
  const item = tree.getItemAtPath(state.root, state.path);
  const parentPath = tree.getPathParent(state.path);
  return {
    root: tree.updateItemByPath(state.root, parentPath, (i) => ({
      ...i,
      children: i.children.filter((child) => child != item),
    })),
    path: tree.getItemAbove(state.root, state.path),
  };
};

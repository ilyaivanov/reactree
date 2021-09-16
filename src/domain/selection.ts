import * as tree from "./itemsTree";

export const changeSelection = (
  state: AppState,
  newSelected: Path
): AppState => {
  const withoutSelection = tree.updateItemByPath(
    state.root,
    state.path,
    (i) => ({
      ...i,
      isSelected: false,
    })
  );
  const withSelected = tree.updateItemByPath(
    withoutSelection,
    newSelected,
    (i) => ({
      ...i,
      isSelected: true,
    })
  );
  return {
    root: withSelected,
    path: newSelected,
  };
};

export const unselectAt =
  (path: Path) =>
  (state: AppState): AppState => ({
    root: tree.updateItemByPath(state.root, path, (i) => ({
      ...i,
      isSelected: false,
    })),
    path: state.path,
  });

export const selectAt =
  (path: Path) =>
  (state: AppState): AppState => ({
    root: tree.updateItemByPath(state.root, path, (i) => ({
      ...i,
      isSelected: true,
    })),
    path: path,
  });

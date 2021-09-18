import * as tree from "./itemsTree";

export const changeSelection = (
  state: AppState,
  newSelected: Path
): AppState => selectAt(unselectAt(state, state.path), newSelected);

export const unselectAt =
  (state: AppState, path: Path): AppState => ({
    root: tree.updateItemByPath(state.root, path, (i) => ({
      ...i,
      isSelected: false,
    })),
    path: state.path,
  });

export const selectAt =
  (state: AppState, path: Path): AppState => ({
    root: tree.updateItemByPath(state.root, path, (i) => ({
      ...i,
      isSelected: true,
    })),
    path: path,
  });

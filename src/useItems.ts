import { useReducer } from "react";
import * as tree from "./domain/itemsTree";

const rootItem = tree.createItem("Root", [
  tree.createItem("Item 1"),
  tree.createItem("Item 2", [
    tree.createItem("Item 3"),
    tree.createItem("Item 4"),
    tree.createItem("Item 5"),
  ]),
  tree.createItem("Item 6"),
]);

const randomInt = (from: number, to: number) =>
  Math.floor(from + Math.random() * (to - from));

type Action = "moveDown" | "moveUp" | "moveLeft" | "moveRight";

const updatePath = (state: State, path: tree.Path): State => ({
  path,
  root: state.root,
});

const updateRoot = (state: State, root: Item): State => ({
  root,
  path: state.path,
});

const dispatch = (state: State, action: Action): State => {
  if (action === "moveDown")
    return updatePath(state, tree.getItemBelow(state.root, state.path));
  if (action === "moveUp")
    return updatePath(state, tree.getItemAbove(state.root, state.path));

  if (action === "moveLeft") {
    const item = tree.getItemAtPath(state.root, state.path);
    return item.isOpen
      ? updateRoot(
          state,
          tree.updateItemByPath(state.root, state.path, tree.closeItem)
        )
      : updatePath(state, tree.getPathParent(state.path));
  }
  if (action === "moveRight") {
    const item = tree.getItemAtPath(state.root, state.path);
    if (!item.isOpen && item.children.length > 0)
      return updateRoot(
        state,
        tree.updateItemByPath(state.root, state.path, tree.openItem)
      );
    else if (item.children.length > 0)
      return updatePath(state, [...state.path, 0]);
    else
      return updateRoot(
        state,
        tree.updateItemByPath(state.root, state.path, (i) => ({
          ...i,
          isOpen: true,
          children: randomItems(),
        }))
      );
  }

  return state;
};

type Dispatch = (action: Action) => void;
type State = { root: Item; path: tree.Path };

export const useItems = (): [State, Dispatch] =>
  useReducer(dispatch, { root: rootItem, path: [0] });

const randomItems = (): Item[] =>
  Array.from(new Array(randomInt(5, 20))).map((_, i) => ({
    id: "rid_" + Math.random(),
    title: "Random Item " + (i + 1),
    children: [],
    isOpen: false,
  }));

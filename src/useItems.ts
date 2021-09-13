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

type PlainAction<T> = { type: T };

type Action =
  | PlainAction<"move-down">
  | PlainAction<"move-up">
  | PlainAction<"move-left">
  | PlainAction<"move-right">
  | PlainAction<"start-edit">
  | {
      type: "finish-rename";
      path: tree.Path;
      newTitle: string;
    };

const reducer = (state: State, action: Action): State => {
  // console.log(`Dispatching ${action.type}`);
  const updatePath = (path: tree.Path): State => ({
    path,
    root: state.root,
  });

  const updateRoot = (root: Item): State => ({
    root,
    path: state.path,
  });

  if (action.type === "move-down")
    return updatePath(tree.getItemBelow(state.root, state.path));
  else if (action.type === "move-up")
    return updatePath(tree.getItemAbove(state.root, state.path));
  else if (action.type === "move-left") {
    const item = tree.getItemAtPath(state.root, state.path);
    return item.isOpen
      ? updateRoot(
          tree.updateItemByPath(state.root, state.path, tree.closeItem)
        )
      : updatePath(tree.getPathParent(state.path));
  } else if (action.type === "move-right") {
    const item = tree.getItemAtPath(state.root, state.path);
    if (!item.isOpen && item.children.length > 0)
      return updateRoot(
        tree.updateItemByPath(state.root, state.path, tree.openItem)
      );
    else if (item.children.length > 0) return updatePath([...state.path, 0]);
    else
      return updateRoot(
        tree.updateItemByPath(state.root, state.path, (i) => ({
          ...i,
          isOpen: true,
          children: tree.randomItems(),
        }))
      );
  } else if (action.type === "start-edit") {
    return updateRoot(
      tree.updateItemByPath(state.root, state.path, (i) => ({
        ...i,
        isEditing: true,
      }))
    );
  } else if (action.type === "finish-rename") {
    return updateRoot(
      tree.updateItemByPath(state.root, action.path, (i) => ({
        ...i,
        title: action.newTitle,
        isEditing: false,
      }))
    );
  }

  exhaustCheck(action);
  return state;
};

const exhaustCheck = (a: never): never => a;

export type Dispatch = (action: Action) => void;
type State = { root: Item; path: tree.Path };

export const useItems = (): [State, Dispatch] => {
  const [state, dispatch] = useReducer(reducer, { root: rootItem, path: [0] });
  return [state, dispatch];
};

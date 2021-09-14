import { useReducer } from "react";
import * as tree from "../../domain/itemsTree";
import * as treeOperations from "../../domain/createRemoveRename";
import { array } from "../../domain/primitives";
import * as movement from "../../domain/movement";

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
  | PlainAction<"remove-selected">
  | PlainAction<"create-new-item-after-selected">
  | PlainAction<"selection/moveRight">
  | PlainAction<"selection/moveLeft">
  | PlainAction<"movement/moveDown">
  | PlainAction<"movement/moveUp">
  | {
      type: "finish-rename";
      path: Path;
      newTitle: string;
    };

const reducer = (state: AppState, action: Action): AppState => {
  // console.log(`Dispatching ${action.type}`);
  const updatePath = (path: Path): AppState => ({
    path,
    root: state.root,
  });

  const updateRoot = (root: Item): AppState => ({
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
    else return state;
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
  } else if (action.type === "remove-selected") {
    return treeOperations.removeSelectedItem(state);
  } else if (action.type === "create-new-item-after-selected") {
    if (tree.isPathRoot(state.path)) return state;

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
  } else if (action.type === "selection/moveLeft")
    return movement.moveItemLeft(state);
  else if (action.type === "selection/moveRight")
    return movement.moveItemRight(state);
  else if (action.type === "movement/moveDown")
    return movement.moveItemDown(state);
  else if (action.type === "movement/moveUp") {
    return movement.moveItemUp(state);
  }

  exhaustCheck(action);
  return state;
};

const exhaustCheck = (a: never): never => a;

export type Dispatch = (action: Action) => void;

export const useItems = (): [AppState, Dispatch] => {
  const [state, dispatch] = useReducer(reducer, { root: rootItem, path: [0] });
  return [state, dispatch];
};

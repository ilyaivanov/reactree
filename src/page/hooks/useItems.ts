import { Component, useReducer } from "react";
import * as tree from "../../domain/itemsTree";
import * as treeOperations from "../../domain/createRemoveRename";
import * as movement from "../../domain/movement";
import * as selection from "../../domain/selection";

const defaultState: AppState = {
  root: {
    id: "ID_HOME",
    isOpen: true,
    isSelected: true,
    title: "Home",
    children: [],
  },
  path: [],
};

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
  const updateRoot = (root: Item): AppState => ({
    root,
    path: state.path,
  });

  if (action.type === "move-down")
    return selection.changeSelection(
      state,
      tree.getItemBelow(state.root, state.path)
    );
  else if (action.type === "move-up")
    return selection.changeSelection(
      state,
      tree.getItemAbove(state.root, state.path)
    );
  else if (action.type === "move-left") {
    const item = tree.getItemAtPath(state.root, state.path);
    return item.isOpen
      ? updateRoot(
          tree.updateItemByPath(state.root, state.path, tree.closeItem)
        )
      : selection.changeSelection(state, tree.getPathParent(state.path));
  } else if (action.type === "move-right") {
    const item = tree.getItemAtPath(state.root, state.path);
    if (!item.isOpen && item.children.length > 0)
      return updateRoot(
        tree.updateItemByPath(state.root, state.path, tree.openItem)
      );
    else if (item.children.length > 0)
      return selection.changeSelection(state, [...state.path, 0]);
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
    return treeOperations.removeSelectedItemAnsSelectPrevious(state);
  } else if (action.type === "create-new-item-after-selected") {
    return treeOperations.createNewItem(state);
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

const saveItems = (state: AppState): void => {
  localStorage.setItem("items:v1", JSON.stringify(state));
};

const loadItems = (): AppState | undefined => {
  const cache = localStorage.getItem("items:v1");
  if (cache) return JSON.parse(cache);
  return undefined;
};

//reducer with side-effects, I know
let timer: NodeJS.Timer;
export const cancelPendingStateSave = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

export class ErrorBoundaryClearingPendingStateSync extends Component {
  componentDidCatch() {
    cancelPendingStateSave();
  }

  render() {
    return this.props.children;
  }
}

const persistingReducer = (state: AppState, action: Action): AppState => {
  cancelPendingStateSave();
  const nextState = reducer(state, action);
  timer = setTimeout(() => saveItems(nextState), 200);
  return nextState;
};

const exhaustCheck = (a: never): never => a;

export type Dispatch = (action: Action) => void;

export const useItems = (): [AppState, Dispatch] => {
  const savedState = loadItems();
  const initialState: AppState = savedState || defaultState;

  return useReducer(persistingReducer, initialState);
};

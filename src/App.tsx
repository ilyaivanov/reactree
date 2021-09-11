import React, { useReducer } from "react";
import "./App.css";

type Item = {
  title: string;
  children: Item[];
  isOpen: boolean;
  parent?: Item;
};

const createItem = (title: string, children?: Item[]): Item => {
  const item: Item = {
    title,
    isOpen: children ? children.length > 0 : false,
    children: children || [],
  };

  children && children.forEach((child) => (child.parent = item));
  return item;
};

const root = createItem("Root", [
  createItem("Item 1"),
  createItem("Item 2", [
    createItem("Item 3"),
    createItem("Item 4"),
    createItem("Item 5"),
  ]),
  createItem("Item 6"),
]);

const getItemOffsetFromParent = (item: Item) => {
  if (!item.parent) return 0;
};

function App() {
  const [tree, dispatch] = useReducer((x) => x, root);
  return (
    <div>
      <svg viewBox="0 0 500 500" width="500" height="500">
        <circle cx="5" cy="5" r="5" fill="red"></circle>
      </svg>
    </div>
  );
}

export default App;

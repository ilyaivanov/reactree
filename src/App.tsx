import React, { useReducer } from "react";
import "./App.css";
import * as tree from "./domain/itemsTree";

const root = tree.createItem("Root", [
  tree.createItem("Item 1"),
  tree.createItem("Item 2", [
    tree.createItem("Item 3"),
    tree.createItem("Item 4"),
    tree.createItem("Item 5"),
  ]),
  tree.createItem("Item 6"),
]);

function App() {
  const [tree, dispatch] = useReducer((x) => x, root);
  return (
    <div style={{ color: colors.text, backgroundColor: colors.background }}>
      <svg viewBox="0 0 500 500" width="500" height="500">
        {selectionBox()}
        {itemView(tree)}
      </svg>
    </div>
  );
}

const selectionBox = () => {
  const { gap, yStep } = spacings;
  return (
    <rect
      x="0"
      y={gap + yStep * 2 - yStep / 2}
      width="500"
      height={yStep}
      fill={colors.selectionColor}
    />
  );
};

const itemView = (item: Item) => {
  const y = item.parent
    ? tree.getItemOffsetFromParent(item) * spacings.yStep
    : spacings.gap;
  const x = item.parent ? spacings.xStep : spacings.gap;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={spacings.circleRadius} fill="red"></circle>
      <text
        x={spacings.circleRadius + spacings.circleToTextDistance}
        dy="0.32em"
        fill="currentColor"
      >
        {item.title}
      </text>
      <g>{item.isOpen && item.children.map(itemView)}</g>
    </g>
  );
};

//DESIGN SYSTEM
const spacings = {
  gap: 30,
  xStep: 20,
  yStep: 20,
  circleRadius: 5,
  circleToTextDistance: 5,
};

const colors = {
  selectionColor: "rgb(42,45,46)",
  background: "#1E1E1E",
  text: "white",
};

export default App;

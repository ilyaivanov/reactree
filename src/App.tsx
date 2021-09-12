import React, { useEffect, useReducer, useState } from "react";
import "./App.css";
import * as tree from "./domain/itemsTree";
import { useWindowSize } from "./infra/useWindowDimensions";

const rootItem = tree.createItem("Root", [
  tree.createItem("Item 1"),
  tree.createItem("Item 2", [
    tree.createItem("Item 3"),
    tree.createItem("Item 4"),
    tree.createItem("Item 5"),
  ]),
  tree.createItem("Item 6"),
]);

function App() {
  const [root, setRoot] = useState(rootItem);
  const [selectedPath, setPath] = useState([0]);

  const dimensions = useWindowSize();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown")
        setPath((path) => tree.getItemBelow(root, path));
      if (e.code === "ArrowUp")
        setPath((path) => tree.getItemAbove(root, path));

      if (e.code === "ArrowLeft") {
        const item = tree.getItemAtPath(root, selectedPath);
        if (item.isOpen)
          setRoot(tree.updateItemByPath(root, selectedPath, tree.closeItem));
        else setPath(tree.getPathParent);
      }
      if (e.code === "ArrowRight") {
        const item = tree.getItemAtPath(root, selectedPath);
        if (!item.isOpen && item.children.length > 0)
          setRoot(tree.updateItemByPath(root, selectedPath, tree.openItem));
        else if (item.children.length > 0) setPath((p) => [...p, 0]);
        else {
          //load and append
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [root, selectedPath]);

  return (
    <div style={{ color: colors.text, backgroundColor: colors.background }}>
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        width={dimensions.width}
        height={dimensions.height}
      >
        {selectionBox(root, selectedPath)}
        {itemView(root, root, [])}
      </svg>
    </div>
  );
}

const selectionBox = (root: Item, path: tree.Path) => {
  const { gap, yStep } = spacings;
  return (
    <rect
      x="0"
      y={gap + yStep * tree.getPathPositionFromRoot(root, path) - yStep / 2}
      width={window.innerWidth}
      height={yStep}
      fill={colors.selectionColor}
    />
  );
};

const itemView = (root: Item, item: Item, path: tree.Path) => {
  const y = !tree.isPathRoot(path)
    ? tree.getItemOffsetFromParent(root, path) * spacings.yStep
    : spacings.gap;
  const x = !tree.isPathRoot(path) ? spacings.xStep : spacings.gap;
  return (
    <g transform={`translate(${x}, ${y})`} key={item.id}>
      <path
        d={svgPath(tree.isPathRoot(path), y)}
        strokeWidth={strokeWidth}
        stroke={colors.line}
        fill={"none"}
      />
      <circle
        r={spacings.circleRadius}
        fill={colors.circle}
        stroke={colors.circleBorder}
        strokeWidth={spacings.circleBorder}
      ></circle>

      <text
        x={spacings.circleRadius + spacings.circleToTextDistance}
        dy="0.32em"
        fill="currentColor"
        fontSize={14}
      >
        {item.title}
      </text>
      <g>
        {item.isOpen &&
          item.children.map((item, index) =>
            itemView(root, item, [...path, index])
          )}
      </g>
    </g>
  );
};

//this 0.5 offset creates a clear separation for 1-pixel sized lines
//it depends upon the stroke
const strokeWidth: number = 2;
const strokeOffset = strokeWidth === 1 ? 0.5 : 0;
const svgPath = (isRoot: boolean, distanceToParent: number): string =>
  !isRoot
    ? `M0,${strokeOffset}H-${spacings.xStep + strokeOffset}V-${
        distanceToParent - spacings.circleRadius
      }`
    : "";

//DESIGN SYSTEM
const spacings = {
  gap: 30,
  xStep: 20,
  yStep: 20,
  circleRadius: 5,
  circleBorder: 3.5,
  circleToTextDistance: 5,
};

const colors = {
  selectionColor: "rgb(42,45,46)",
  background: "#0B101C",
  text: "white",
  circle: "white",
  circleBorder: "#71747F",
  line: "#71747F",
};

export default App;

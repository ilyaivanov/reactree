import { useEffect } from "react";
import * as tree from "./domain/itemsTree";
import { useWindowSize } from "./infra/useWindowDimensions";
import { Scrollbar } from "./scrollbar";
import { useItems } from "./useItems";

const calculateContentHeightLongCalculation = (item: Item): number => {
  let count = 0;
  tree.forEachVisibleChild(item, () => (count += 1));
  return count * spacings.yStep + 2 * spacings.gap;
};

function App() {
  const [{ root, path }, dispatch] = useItems();
  const dimensions = useWindowSize();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") dispatch("moveDown");
      if (e.code === "ArrowUp") dispatch("moveUp");
      if (e.code === "ArrowLeft") dispatch("moveLeft");
      if (e.code === "ArrowRight") dispatch("moveRight");
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [root, path, dispatch]);

  return (
    <div style={{ color: colors.text, backgroundColor: colors.background }}>
      <Scrollbar
        windowHeight={dimensions.height}
        contentHeight={calculateContentHeightLongCalculation(root)}
      >
        {(windowOffset) => (
          <svg
            viewBox={`0 ${windowOffset} ${dimensions.width} ${dimensions.height}`}
            width={dimensions.width}
            height={dimensions.height}
          >
            {selectionBox(root, path)}
            {itemView(root, root, [])}
          </svg>
        )}
      </Scrollbar>
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
  selectionColor: "rgb(113,116,127,0.2)",
  background: "#0B101C",
  text: "white",
  circle: "white",
  circleBorder: "#71747F",
  line: "#71747F",
};

export default App;

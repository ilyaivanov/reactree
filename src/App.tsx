import { memo, useEffect } from "react";
import * as tree from "./domain/itemsTree";
import { useWindowSize } from "./infra/useWindowDimensions";
import { Scrollbar } from "./scrollbarClass";
import { ItemView } from "./tree/ItemView";
import { useItems } from "./useItems";
import { colors, spacings } from "./designSystem";

const openItemsCount = (item: Item): number => {
  let count = 0;
  tree.forEachVisibleChild(item, () => (count += 1));
  return count;
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

  const itemsCount = openItemsCount(root);
  return (
    <div style={{ color: colors.text, backgroundColor: colors.background }}>
      <Scrollbar
        windowHeight={dimensions.height}
        contentHeight={itemsCount * spacings.yStep + 2 * spacings.gap}
      >
        {(windowOffset) => (
          <svg
            viewBox={`0 ${windowOffset} ${dimensions.width} ${dimensions.height}`}
            width={dimensions.width}
            height={dimensions.height}
          >
            <SelectionBox root={root} path={path} />
            <ItemView root={root} item={root} path={[]} />
          </svg>
        )}
      </Scrollbar>
      <div className="itemsCountLabel">Items Count: {itemsCount}</div>
    </div>
  );
}

type SelectionBoxProps = {
  root: Item;
  path: tree.Path;
};
const SelectionBox = memo((props: SelectionBoxProps) => {
  const { root, path } = props;
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
});

export default App;

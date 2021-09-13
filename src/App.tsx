import { memo, useEffect } from "react";
import * as tree from "./domain/itemsTree";
import { useWindowSize } from "./infra/useWindowDimensions";
import { Scrollbar } from "./scrollbar";
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
  const windowSize = useWindowSize();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") dispatch({ type: "move-down" });
      if (e.code === "ArrowUp") dispatch({ type: "move-up" });
      if (e.code === "ArrowLeft") dispatch({ type: "move-left" });
      if (e.code === "ArrowRight") dispatch({ type: "move-right" });
      if (e.code === "Space") dispatch({ type: "start-edit" });
      if (e.code === "Backspace" && e.shiftKey && e.ctrlKey)
        dispatch({ type: "remove-selected" });
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [root, path, dispatch]);

  const itemsCount = openItemsCount(root);
  return (
    <div style={{ color: colors.text, backgroundColor: colors.background }}>
      <div className="itemsCountLabel">{itemsCount}</div>
      <Scrollbar
        windowHeight={windowSize.height}
        contentHeight={itemsCount * spacings.yStep + 2 * spacings.gap}
      >
        {(windowOffset) => (
          <svg
            viewBox={`0 ${windowOffset} ${windowSize.width} ${windowSize.height}`}
            width={windowSize.width}
            height={windowSize.height}
          >
            <SelectionBox root={root} path={path} width={windowSize.width} />
            <ItemView item={root} path={[]} dispatch={dispatch} />
          </svg>
        )}
      </Scrollbar>
    </div>
  );
}

type SelectionBoxProps = {
  root: Item;
  path: tree.Path;
  width: number;
};

const SelectionBox = memo((props: SelectionBoxProps) => {
  const { root, path, width } = props;
  const { gap, yStep } = spacings;
  return (
    <rect
      x="0"
      y={gap + yStep * tree.getPathPositionFromRoot(root, path) - yStep / 2}
      width={width}
      height={yStep}
      fill={colors.selectionColor}
    />
  );
});

export default App;

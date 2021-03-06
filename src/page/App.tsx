import { memo, useEffect } from "react";
import * as tree from "../domain/itemsTree";
import { useWindowSize, useItems } from "./hooks";
import { Scrollbar } from "./Scrollbar";
import { ItemView } from "./ItemView";
import { colors, spacings } from "../designSystem";
import { ErrorBoundaryClearingPendingStateSync } from "./hooks/useItems";

import "./App.css";

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
      if (e.code === "ArrowLeft" && e.altKey && e.shiftKey)
        dispatch({ type: "selection/moveLeft" });
      else if (e.code === "ArrowRight" && e.altKey && e.shiftKey)
        dispatch({ type: "selection/moveRight" });
      else if (e.code === "ArrowUp" && e.altKey && e.shiftKey)
        dispatch({ type: "movement/moveUp" });
      else if (e.code === "ArrowDown" && e.altKey && e.shiftKey)
        dispatch({ type: "movement/moveDown" });
      else if (e.code === "ArrowUp") dispatch({ type: "move-up" });
      else if (e.code === "ArrowDown") dispatch({ type: "move-down" });
      else if (e.code === "ArrowUp") dispatch({ type: "move-up" });
      else if (e.code === "ArrowLeft") dispatch({ type: "move-left" });
      else if (e.code === "ArrowRight") dispatch({ type: "move-right" });
      else if (e.code === "KeyE") {
        //prevenring onInput event for input tag while entering edit mode
        e.preventDefault();
        dispatch({ type: "start-edit" });
      } else if (e.code === "Enter")
        dispatch({ type: "create-new-item-after-selected" });
      else if (e.code === "Backspace" && e.shiftKey && e.ctrlKey)
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
  path: Path;
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

const AppWithErrorBoundary = () => (
  <ErrorBoundaryClearingPendingStateSync>
    <App />
  </ErrorBoundaryClearingPendingStateSync>
);

export default AppWithErrorBoundary;

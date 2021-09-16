import { memo, useEffect } from "react";
import * as tree from "../domain/itemsTree";
import { useWindowSize, useItems } from "./hooks";
import { Scrollbar } from "./Scrollbar";
import { ItemView } from "./ItemView";
import { colors, spacings } from "../designSystem";
import {
  Dispatch,
  ErrorBoundaryClearingPendingStateSync,
} from "./hooks/useItems";

import "./App.css";
import React from "react";
import { TitleInput } from "./TitleInput";

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
      e.preventDefault();
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
    <div className="app">
      <div className="itemsCountLabel">{itemsCount}</div>
      <div style={{ paddingRight: 10, fontSize: 14 }}>
        <div style={{ paddingTop: spacings.gap - 6 }}>
          <TextItem item={root} level={0} dispatch={dispatch} path={[]} />
        </div>
      </div>
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
type Props = {
  item: Item;
  level: number;
  dispatch: Dispatch;
  path: Path;
};
class TextItem extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.item !== this.props.item || nextProps.level !== this.props.level
    );
  }
  render() {
    const { item, level, dispatch, path } = this.props;
    return (
      <div
        style={{
          paddingLeft: level == 0 ? spacings.gap : spacings.xStep,
          marginTop: 8,
          lineHeight: 1.2,
        }}
      >
        <div
          style={{
            backgroundColor: item.isSelected
              ? colors.selectionColor
              : undefined,
          }}
        >
          {item.isEditing ? (
            <TitleInput title={item.title} path={path} dispatch={dispatch} />
          ) : (
            item.title
          )}
        </div>
        <div style={{ borderLeft: "1px solid grey" }}>
          {item.isOpen &&
            item.children.map((child, index) => (
              <TextItem
                key={child.id}
                item={child}
                level={level + 1}
                dispatch={dispatch}
                path={[...path, index]}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default AppWithErrorBoundary;

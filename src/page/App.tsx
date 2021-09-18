import { useEffect } from "react";
import { useItems } from "./hooks";
import { spacings } from "../designSystem";
import { ErrorBoundaryClearingPendingStateSync } from "./hooks/useItems";

import "./App.css";
import { TextItem } from "./Item";
function App() {
  const [{ root, path }, dispatch] = useItems();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.code === "ArrowLeft" && e.altKey && e.shiftKey)
        dispatch({ type: "movement/moveLeft" });
      else if (e.code === "ArrowRight" && e.altKey && e.shiftKey)
        dispatch({ type: "movement/moveRight" });
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

  return (
    <div className="app">
      <div style={{ paddingRight: 10, fontSize: 14 }}>
        <div style={{ paddingTop: spacings.gap - 6 }}>
          <TextItem item={root} level={0} dispatch={dispatch} path={[]} />
        </div>
      </div>
    </div>
  );
}

const AppWithErrorBoundary = () => (
  <ErrorBoundaryClearingPendingStateSync>
    <App />
  </ErrorBoundaryClearingPendingStateSync>
);

export default AppWithErrorBoundary;

import { useEffect, useState } from "react";
import { clamp } from "./domain/number";

type Props = {
  contentHeight: number;
  windowHeight: number;
  children: (xOffset: number) => JSX.Element;
};

export const Scrollbar = ({ children, windowHeight, contentHeight }: Props) => {
  const [thumbOffset, setThumbOffset] = useState(0);

  const [mouseOffsetOnMouseDown, setMouseOffsetOnMouseDown] = useState<
    number | undefined
  >(undefined);

  const thumbHeight = (windowHeight * windowHeight) / contentHeight;
  const windowOffset = (thumbOffset * contentHeight) / windowHeight;

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (contentHeight > windowHeight) {
        const maxvalue = windowHeight - thumbHeight;
        const delta = e.deltaY * (windowHeight / contentHeight);
        setThumbOffset((offset) => clamp(offset + delta, 0, maxvalue));
      }
    };
    document.addEventListener("wheel", onWheel);
    return () => document.removeEventListener("wheel", onWheel);
  }, [contentHeight, windowHeight, thumbHeight]);

  useEffect(() => {
    const isMouseDown = typeof mouseOffsetOnMouseDown !== "undefined";
    const onMove = (e: MouseEvent) => {
      const maxvalue = windowHeight - thumbHeight;
      setThumbOffset((offset) => clamp(offset + e.movementY, 0, maxvalue));
    };

    const onMouseUp = () => {
      setMouseOffsetOnMouseDown(undefined);
    };

    if (isMouseDown) {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [mouseOffsetOnMouseDown, thumbHeight, windowHeight]);

  return (
    <div className="scrollbar">
      {children(windowOffset)}
      {contentHeight > windowHeight && (
        <div
          className="scrollThumb"
          onMouseDown={(e) => {
            setMouseOffsetOnMouseDown(e.clientY - thumbOffset);
          }}
          style={{ height: thumbHeight, top: thumbOffset }}
        />
      )}
    </div>
  );
};

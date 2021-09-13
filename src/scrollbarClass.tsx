import React from "react";
import { clamp } from "./domain/number";

type Props = {
  contentHeight: number;
  windowHeight: number;
  children: (xOffset: number) => JSX.Element;
};
type State = {
  thumbOffset: number;
  mouseOffsetOnMouseDown: number | undefined;
};

//Handles mouseWheel and scroll thumb drag events
export class Scrollbar extends React.Component<Props, State> {
  state = {
    thumbOffset: 0,
    mouseOffsetOnMouseDown: undefined,
  };

  thumbHeight = () =>
    (this.props.windowHeight * this.props.windowHeight) /
    this.props.contentHeight;

  setThumbOffset = (setter: (currentOffset: number) => number) => {
    const maxvalue = this.props.windowHeight - this.thumbHeight();
    this.setState((state) => ({
      thumbOffset: clamp(setter(state.thumbOffset), 0, maxvalue),
    }));
  };

  onThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({
      mouseOffsetOnMouseDown: e.clientY - this.state.thumbOffset,
    });
    document.addEventListener("mousemove", this.onDocumentMouseMove);
    document.addEventListener("mouseup", this.onDocumentMouseUp);
  };

  onDocumentMouseUp = () => {
    document.removeEventListener("mousemove", this.onDocumentMouseMove);
    document.removeEventListener("mouseup", this.onDocumentMouseUp);
  };

  onDocumentMouseMove = (e: MouseEvent) =>
    this.setThumbOffset((offset) => offset + e.movementY);

  componentDidMount() {
    document.addEventListener("wheel", this.onMouseWheel);
  }

  componentWillUnmount() {
    document.removeEventListener("wheel", this.onMouseWheel);
  }

  onMouseWheel = (e: WheelEvent) => {
    const { contentHeight, windowHeight } = this.props;
    if (contentHeight > windowHeight)
      this.setThumbOffset((offset) => {
        const delta = e.deltaY * (windowHeight / contentHeight);
        return offset + delta;
      });
  };

  render() {
    const { contentHeight, windowHeight, children } = this.props;
    const { thumbOffset } = this.state;

    const windowOffset = (thumbOffset * contentHeight) / windowHeight;
    return (
      <div className="scrollbar">
        {children(windowOffset)}
        {contentHeight > windowHeight && (
          <div
            className="scrollThumb"
            onMouseDown={this.onThumbMouseDown}
            style={{ height: this.thumbHeight(), top: thumbOffset }}
          />
        )}
      </div>
    );
  }
}

import React from "react";
import { clamp } from "../domain/primitives/number";

type Props = {
  contentHeight: number;
  windowHeight: number;
  children: (xOffset: number) => JSX.Element;
};
type State = {
  windowOffset: number;
  mouseOffsetOnMouseDown: number | undefined;
};

//Handles mouseWheel and scroll thumb drag events
export class Scrollbar extends React.PureComponent<Props, State> {
  state = {
    windowOffset: 0,
    mouseOffsetOnMouseDown: undefined,
  };

  thumbOffset = () => {
    const { contentHeight, windowHeight } = this.props;
    const { windowOffset } = this.state;

    return (windowOffset * windowHeight) / contentHeight;
  };

  thumbHeight = () =>
    (this.props.windowHeight * this.props.windowHeight) /
    this.props.contentHeight;

  setWindowOffset = (setter: (currentOffset: number) => number) => {
    const maxvalue = this.props.contentHeight - this.props.windowHeight;
    this.setState((state) => ({
      windowOffset: clamp(setter(state.windowOffset), 0, maxvalue),
    }));
  };

  onThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({
      mouseOffsetOnMouseDown: e.clientY - this.thumbOffset(),
    });
    document.addEventListener("mousemove", this.onDocumentMouseMove);
    document.addEventListener("mouseup", this.onDocumentMouseUp);
  };

  onDocumentMouseUp = () => {
    document.removeEventListener("mousemove", this.onDocumentMouseMove);
    document.removeEventListener("mouseup", this.onDocumentMouseUp);
  };

  onDocumentMouseMove = (e: MouseEvent) =>
    this.setWindowOffset(
      (offset) =>
        offset +
        e.movementY * (this.props.contentHeight / this.props.windowHeight)
    );

  componentDidMount() {
    //wheel events should be attached to svg container
    document.addEventListener("wheel", this.onMouseWheel);
  }

  componentWillUnmount() {
    document.removeEventListener("wheel", this.onMouseWheel);
  }

  onMouseWheel = (e: WheelEvent) => {
    const { contentHeight, windowHeight } = this.props;
    if (contentHeight > windowHeight)
      this.setWindowOffset((offset) => offset + e.deltaY);
  };

  render() {
    const { contentHeight, windowHeight, children } = this.props;
    const { windowOffset } = this.state;

    return (
      <div className="scrollbar">
        {children(windowOffset)}
        {contentHeight > windowHeight && (
          <div
            className="scrollThumb"
            onMouseDown={this.onThumbMouseDown}
            style={{ height: this.thumbHeight(), top: this.thumbOffset() }}
          />
        )}
      </div>
    );
  }
}

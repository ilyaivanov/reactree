import { Component } from "react";
import { colors, spacings } from "../designSystem";
import * as tree from "../domain/itemsTree";
import { Dispatch } from "./hooks/useItems";

type ItemViewProps = {
  item: Item;
  path: Path;
  parent?: Item;
  dispatch: Dispatch;
};

export class ItemView extends Component<ItemViewProps> {
  shouldComponentUpdate(nextProps: ItemViewProps) {
    return (
      this.props.item !== nextProps.item ||
      this.props.parent !== nextProps.parent
    );
  }

  renderText = () => {
    const { item, dispatch } = this.props;
    if (this.props.item.isEditing)
      return (
        <foreignObject
          x={spacings.circleRadius + spacings.circleToTextDistance}
          y={-12}
          height={spacings.yStep}
          width={2000}
        >
          <input
            className="my-input"
            autoFocus
            placeholder="Enter Title"
            defaultValue={this.props.item.title}
            onFocus={(e) => e.currentTarget.setSelectionRange(0, 0)}
            onBlur={(e) => {
              dispatch({
                type: "finish-rename",
                path: this.props.path,
                newTitle: e.currentTarget.value,
              });
            }}
            onKeyDown={(e) => {
              if (
                e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "Enter" ||
                e.key === "Escape"
              ) {
                //avoid creating new item on enter during edit
                if (e.key === "Enter") e.stopPropagation();
                dispatch({
                  type: "finish-rename",
                  path: this.props.path,
                  newTitle: e.currentTarget.value,
                });
              } else {
                e.stopPropagation();
              }
            }}
          />
        </foreignObject>
      );
    else
      return (
        <text
          x={spacings.circleRadius + spacings.circleToTextDistance}
          dy="0.32em"
          fill="currentColor"
          style={{ whiteSpace: "pre" }}
          fontSize={14}
        >
          {item.title}
        </text>
      );
  };

  render() {
    const { parent, item, path, dispatch } = this.props;
    const y = parent
      ? tree.getItemOffsetFromParent(parent, item) * spacings.yStep
      : spacings.gap;
    const x = !tree.isPathRoot(path) ? spacings.xStep : spacings.gap;
    return (
      <g transform={`translate(${x}, ${y})`}>
        <path
          d={svgPath(tree.isPathRoot(path), y)}
          strokeWidth={strokeWidth}
          stroke={colors.line}
          fill={"none"}
        />
        <circle
          r={spacings.circleRadius}
          fill={item.children.length === 0 ? colors.background : colors.circle}
          stroke={colors.circleBorder}
          strokeWidth={spacings.circleBorder}
        ></circle>

        {this.renderText()}
        <g>
          {item.isOpen &&
            item.children.map((child, index) => (
              <ItemView
                key={child.id}
                parent={item}
                item={child}
                dispatch={dispatch}
                path={[...path, index]}
              />
            ))}
        </g>
      </g>
    );
  }
}

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

import { Component } from "react";
import { colors, spacings } from "../designSystem";
import * as tree from "../domain/itemsTree";

type ItemViewProps = {
  item: Item;
  path: tree.Path;
  parent?: Item;
};

export class ItemView extends Component<ItemViewProps> {
  shouldComponentUpdate(nextProps: ItemViewProps) {
    return (
      this.props.item !== nextProps.item ||
      this.props.parent !== nextProps.parent
    );
  }

  render() {
    const { parent, item, path } = this.props;
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
            item.children.map((child, index) => (
              <ItemView
                key={child.id}
                parent={item}
                item={child}
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

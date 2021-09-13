import { colors, spacings } from "../designSystem";
import * as tree from "../domain/itemsTree";

type ItemViewProps = {
  root: Item;
  item: Item;
  path: tree.Path;
};
export const ItemView = (props: ItemViewProps) => {
  const { root, item, path } = props;
  const y = !tree.isPathRoot(path)
    ? tree.getItemOffsetFromParent(root, path) * spacings.yStep
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
          item.children.map((item, index) => (
            <ItemView
              key={item.id}
              root={root}
              item={item}
              path={[...path, index]}
            />
          ))}
      </g>
    </g>
  );
};

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

import React from "react";
import { colors, spacings } from "../designSystem";
import { style } from "../styles/style";
import { Dispatch } from "./hooks/useItems";
import { TitleInput } from "./TitleInput";

type Props = {
  item: Item;
  level: number;
  dispatch: Dispatch;
  path: Path;
};
export class TextItem extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.item !== this.props.item || nextProps.level !== this.props.level
    );
  }
  render() {
    const { item, level, dispatch, path } = this.props;
    return (
      <div className={"item " + itemLevelClass(level)}>
        <div
          className={cn({
            "item-title": true,
            "item-title__selected": item.isSelected,
          })}
        >
          {!item.isOpen && item.children.length > 0 && (
            <span className="item-childrenIndicator">.</span>
          )}
          {item.isEditing ? (
            <TitleInput title={item.title} path={path} dispatch={dispatch} />
          ) : (
            item.title || <div>&nbsp;</div>
          )}
        </div>
        <div className="item-children">
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

const itemLevelClass = (level: number): string => `item__level${level}`;
for (var level = 0; level < 20; level++) {
  style.class(itemLevelClass(level), {
    paddingLeft: level === 0 ? spacings.gap : spacings.xStep,
  });
}

style.class("item", {
  // marginTop: 6,
  lineHeight: 1.2,
});

style.class("item-children", {
  borderLeft: "1px solid grey",
});

style.class("item-childrenIndicator", {
  position: "absolute",
  left: -5,
  top: -1,
});

style.class("item-title", {
  //used to position item-childrenIndicator
  position: "relative",
  paddingTop: 3,
  paddingBottom: 3,
});

style.class("item-title__selected", {
  backgroundColor: colors.selectionColor,
});

const cn = (classes: Record<string, boolean | undefined>) =>
  Object.entries(classes)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(" ");

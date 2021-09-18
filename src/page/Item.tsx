import React from "react";
import { colors, spacings } from "../designSystem";
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
            position: "relative",
          }}
        >
          {!item.isOpen && item.children.length > 0 && (
            <span style={{ position: "absolute", left: -5, top: -4 }}>.</span>
          )}
          {item.isEditing ? (
            <TitleInput title={item.title} path={path} dispatch={dispatch} />
          ) : (
            item.title || <div>&nbsp;</div>
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

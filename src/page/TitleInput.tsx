import { style } from "../styles/style";
import { Dispatch } from "./hooks/useItems";

type Props = {
  title: string;
  path: Path;
  dispatch: Dispatch;
};

export const TitleInput = ({ title, path, dispatch }: Props) => (
  <textarea
    autoFocus
    className="item-title-input"
    placeholder="Enter Title"
    defaultValue={title}
    style={{
      lineHeight: 1.2,
      display: "block",
      marginBottom: -1,
      height: 10,
      resize: "none",
    }}
    onFocus={(e) => e.currentTarget.setSelectionRange(0, 0)}
    ref={(el) => {
      if (el) {
        el.style.height = el.scrollHeight + "px";
      }
    }}
    onBlur={(e) => {
      dispatch({
        path,
        type: "finish-rename",
        newTitle: e.currentTarget.value,
      });
    }}
    onKeyUp={(e) => {
      const el = e.currentTarget;
      el.style.height = el.scrollHeight + "px";
    }}
    onKeyDown={(e) => {
      e.stopPropagation();
      if (e.key === "Escape" || e.key === "Enter") {
        dispatch({
          type: "finish-rename",
          path,
          newTitle: e.currentTarget.value,
        });
      }
    }}
  />
);

style.class("item-title-input ", {
  boxSizing: `border-box`,
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  color: "white",
  fontSize: 14,
  padding: 0,
  width: "100%",
  fontFamily: `inherit`,
});

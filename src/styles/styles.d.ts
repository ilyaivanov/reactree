type Easing = "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";

type Styles = Partial<{
  //display
  opacity: number;

  //sizing
  height: number | "100vh" | "100%" | string;
  maxHeight: number;
  width: number | string;
  minWidth: number;
  minHeight: number;
  boxSizing: "border-box";

  //margins and paddings
  margin: number | string;
  marginRight: number | "-100%" | "auto";
  marginLeft: number | "auto";
  marginTop: number;
  marginBottom: number;
  padding: number | string;
  paddingRight: number | string;
  paddingLeft: number | string;
  paddingTop: number | string;
  paddingBottom: number | string;

  //positioning
  position: "absolute" | "relative" | "fixed";
  top: number | "100%" | string;
  right: number | string;
  bottom: number;
  left: number | string;
  zIndex: number;
  overflow: "hidden" | "auto" | "scroll" | "overlay";
  overflowX: "hidden" | "auto" | "scroll" | "overlay";
  overflowY: "hidden" | "auto" | "scroll" | "overlay";

  //flex
  flex: number;
  display: "flex" | "inline-block" | "block" | "grid";
  flexDirection: "row" | "column";
  justifyContent: "flex-start" | "center" | "flex-end" | "space-between";
  flexWrap: "wrap";
  alignSelf: "stretch";
  alignItems: "flex-start" | "center" | "flex-end";

  //border
  border: string;
  borderLeft: string;
  borderTop: string;
  borderBottom: string;
  borderRight: string;
  outline: string;
  borderColor: string;
  borderRadius: number | "50%";
  borderTopRightRadius: number;
  borderTopLeftRadius: number;
  borderBottomLeftRadius: number;
  borderBottomRightRadius: number;

  //colors
  backgroundColor: string;

  //transitions
  transition: string;
  transitionTimingFunction: Easing;

  animation: string;
  animationDelay: string | number;

  //typography
  fontFamily: string;
  color: string;
  lineHeight: number | string;
  fontSize: number;
  fontWeight: "bold" | "500" | "600";
  fontStyle: "italic";
  whiteSpace: "nowrap";
  textDecoration: "underline";

  //shadows
  boxShadow: string;
  textShadow: string;

  //svg
  stroke: string;
  strokeWidth: number;
  fill: string;

  //background
  backgroundImage: string;
  backgroundSize: "cover";
  backgroundPosition: string;
  background: string;
  backgroundRepeat: string;

  //grid
  gridTemplateColumns: string;
  gridTemplateRows: string;
  gridTemplateAreas: string;
  gridArea: string;

  //Other
  cursor: "pointer" | "default";
  userSelect: "none";
  transform: string;
  transformOrigin: string;
  pointerEvents: "none" | "all";
  visibility: "hidden";
  content: `" "`;
  objectFit: "cover";
}>;

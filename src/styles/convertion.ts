export const cssRuleToString = (selector: string, styles: Styles): string => {
  let values = Object.entries(
    convertNumericStylesToProperCssOjbect(styles)
  ).map(([key, val]) => `    ${key}: ${val};`);
  return `\n${selector}{\n${values.join("\n")}\n}\n`;
};

// const keyframesToString = (
//   animationName: string,
//   frames: (Styles & { at: string })[]
// ) => {
//   return (
//     `\n@keyframes ${animationName} {` +
//     frames.map((frame) => cssRuleToString(frame.at, frame)).join("") +
//     "\n}"
//   );
// };

export const convertNumericStylesToProperCssOjbect = (styles: Styles): {} =>
  Object.entries(convertNumericStylesToProperJsOjbect(styles)).reduce(
    (res, [key, val]) => {
      res[camelToSnakeCase(key)] = val;
      return res;
    },
    {} as Record<string, string>
  );

export const convertNumericStylesToProperJsOjbect = (
  styles: Styles
): Record<string, string> =>
  Object.entries(styles).reduce((res, [key, val]) => {
    const isNotIgnored = !ignoredStyles[key];
    if (
      typeof val !== "undefined" &&
      isNotIgnored &&
      (typeof val == "number" || typeof val === "string")
    )
      res[key] = convertVal(key, val);
    return res;
  }, {} as Record<string, string>);

const ignoredStyles: Record<string, number> = {
  onHover: 1,
  themes: 1,
  variables: 1,
  at: 1,
};

//I'm using whitelist approach
//in other words I add px to every number values expect 'opacity', 'flex' and other
//and I'm leaving zeros for any value as string without px postfix
const whitelist: Styles = {
  zIndex: 1,
  opacity: 1,
  flex: 1,
  // fontWeight: 1,
  lineHeight: 1,
  animationDelay: 1,
};

const convertVal = (key: string, val: number | string) => {
  if ((whitelist as any)[key]) return val + "";

  if (typeof val == "number") return val + "px";
  return val + "";
};

export const camelToSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

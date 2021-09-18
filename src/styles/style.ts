import { cssRuleToString } from "./convertion";

const existingStyles = document.getElementById("app-styles");
if (existingStyles) existingStyles.remove();

const styleElement = document.createElement("style");

styleElement.id = "app-styles";
document.head.appendChild(styleElement);

const writeToStyles = (selector: string, styles: Styles) => {
  styleElement.innerHTML += cssRuleToString(selector, styles);
};

export const style = {
  class: (className: string, styles: Styles) =>
    writeToStyles(`.${className}`, styles),
};

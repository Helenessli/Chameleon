export type HTMLTag = "container" | "text" | "button" | "textinput" | "form"
export type AttributeName = "button/text" | "textinput/placeholder" | "text/text"
export type Attribute = {
    name: AttributeName;
    value: string;
  };
interface DiscriminatableUiElement {
  type: string;
}

export interface Button extends DiscriminatableUiElement {
  type: "Button";
  text: string;
  marginTopRem: number | null;
  marginRightRem: number | null;
  marginBottomRem: number | null;
  marginLeftRem: number | null;
  paddingTopRem: number | null;
  paddingRightRem: number | null;
  paddingBottomRem: number | null;
  paddingLeftRem: number | null;
}

export interface Text extends DiscriminatableUiElement {
  type: "Text";
  value: string;
  url: string | null;
  marginTopRem: number | null;
  marginRightRem: number | null;
  marginBottomRem: number | null;
  marginLeftRem: number | null;
  paddingTopRem: number | null;
  paddingRightRem: number | null;
  paddingBottomRem: number | null;
  paddingLeftRem: number | null;
}

export interface Container extends DiscriminatableUiElement {
  type: "Container";
  children: UiElement[];
  direction: "row" | "col";
  justify: "start" | "end" | "center" | "between" | "around";
  align: "start" | "end" | "center" | "stretch";
  borderWidthPx: number | null;
  marginTopRem: number | null;
  marginRightRem: number | null;
  marginBottomRem: number | null;
  marginLeftRem: number | null;
  paddingTopRem: number | null;
  paddingRightRem: number | null;
  paddingBottomRem: number | null;
  paddingLeftRem: number | null;
}

export interface TextInput extends DiscriminatableUiElement {
  type: "TextInput";
  placeholder: string;
  marginTopRem: number | null;
  marginRightRem: number | null;
  marginBottomRem: number | null;
  marginLeftRem: number | null;
  paddingTopRem: number | null;
  paddingRightRem: number | null;
  paddingBottomRem: number | null;
  paddingLeftRem: number | null;
}

export interface Form extends DiscriminatableUiElement {
  type: "Form";
  children: UiElement[];
  marginTopRem: number | null;
  marginRightRem: number | null;
  marginBottomRem: number | null;
  marginLeftRem: number | null;
  paddingTopRem: number | null;
  paddingRightRem: number | null;
  paddingBottomRem: number | null;
  paddingLeftRem: number | null;
}

export interface Image extends DiscriminatableUiElement {
  type: "Image";
  url: string | null;
  widthPx: number;
  heightPx: number;
  marginTopRem: number | null;
  marginRightRem: number | null;
  marginBottomRem: number | null;
  marginLeftRem: number | null;
  paddingTopRem: number | null;
  paddingRightRem: number | null;
  paddingBottomRem: number | null;
  paddingLeftRem: number | null;
}

export interface UiElement {
  element: Button | Text | Container | TextInput | Form | Image;
}

export interface Ui {
  root: UiElement;
}

export interface Response {
  ui: Ui;
}


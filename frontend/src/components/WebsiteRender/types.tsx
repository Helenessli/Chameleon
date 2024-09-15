interface DiscriminatableUiElement {
  type: string;
}

export interface Button extends DiscriminatableUiElement {
  type: "Button";
  text: string;
}

export interface Text extends DiscriminatableUiElement {
  type: "Text";
  value: string;
}

export interface Container extends DiscriminatableUiElement {
  type: "Container";
  children: UiElement[];
  direction: "row" | "col";
  justify: "start" | "end" | "center" | "between" | "around";
  align: "start" | "end" | "center" | "stretch";
}

export interface TextInput extends DiscriminatableUiElement {
  type: "TextInput";
  placeholder: string;
}

export interface Form extends DiscriminatableUiElement {
  type: "Form";
  children: UiElement[];
}

export interface UiElement {
  element: Button | Text | Container | TextInput | Form;
}

export interface Ui {
  root: UiElement;
}

export interface Response {
  ui: Ui;
}


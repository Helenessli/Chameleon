interface DiscriminatableUiElement {
  type: str;
}
export interface Button extends DiscriminatableUiElement {
  type: "Button";
  text: str;
}
export interface Text extends DiscriminatableUiElement {
  type: "Text";
  value: str;
}
export interface Container extends DiscriminatableUiElement {
  type: "Container";
  children: UiElement[];
}
export interface TextInput extends DiscriminatableUiElement {
  type: "TextInput";
  placeholder: str;
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


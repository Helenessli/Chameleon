import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UiElement } from "./types";

export function WebsiteRender({ uiElement }: { uiElement: UiElement | UiElement[]}) {
    console.log(uiElement)
    const uiElements = Array.isArray(uiElement) ? uiElement : [uiElement]
    return uiElements.map(uiElement => {
      if (uiElement.element.type == "Container") {
          const direction = uiElement.element.direction == "row" ? "flex-row" : "flex-col";
          const justify = `justify-${uiElement.element.justify}`;
          const align = `items-${uiElement.element.align}`;
          return (
              <div className={`flex ${direction} ${justify} ${align}`}>
                  <WebsiteRender uiElement={uiElement.element.children || []} />
              </div>
          )
      } else if (uiElement.element.type == "Text") {
          return (
              <span>
                  {uiElement.element.value}
              </span>
          )
      } else if (uiElement.element.type == "Button") {
          return (
              <Button>{uiElement.element.text}</Button>
          )
      } else if (uiElement.element.type == "TextInput" ) {
          return (
              <Input placeholder={uiElement.element.placeholder} />
          )
      } else if (uiElement.element.type == "Form") {
          return (
              <div>
                  <WebsiteRender uiElement={uiElement.element.children || []} />
              </div>
          )
      }
    }) 
}

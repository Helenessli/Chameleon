import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { UiElement } from "./types";

export function WebsiteRender({ uiElement }: { uiElement: UiElement | UiElement[]}) {
    console.log(uiElement)
    const uiElements = Array.isArray(uiElement) ? uiElement : [uiElement]
    return uiElements.map(uiElement => {
      if (uiElement.element.type == "Container") {
          return (
              <div className={uiElement.element.direction == "row" ? "flex flex-row" : "flex flex-col"}>
                  <WebsiteRender uiElement={uiElement.element.children || []} />
              </div>
          )
      } else if (uiElement.element.type == "Text") {
          return (
              <Text as={"p"}>
                  {uiElement.element.value}
              </Text>
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

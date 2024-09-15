import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UiElement } from "./types";


export function WebsiteRender({ uiElement }: { uiElement: UiElement | UiElement[]}) {
    const uiElements = Array.isArray(uiElement) ? uiElement : [uiElement]
    return uiElements.map(uiElement => {
      let margins: {[key: string]: string} = {}
      if (uiElement.element.marginTopRem)
        margins["marginTop"] = `${uiElement.element.marginTopRem}rem`
      if (uiElement.element.marginRightRem)
        margins["marginRight"] = `${uiElement.element.marginRightRem}rem`
      if (uiElement.element.marginBottomRem)
        margins["marginBottom"] = `${uiElement.element.marginBottomRem}rem`
      if (uiElement.element.marginLeftRem)
        margins["marginLeft"] = `${uiElement.element.marginLeftRem}rem`

      let padding: {[key: string]: string} = {}
      if (uiElement.element.paddingTopRem)
        padding["paddingTop"] = `${uiElement.element.paddingTopRem}rem`
      if (uiElement.element.paddingRightRem)
        padding["paddingRight"] = `${uiElement.element.paddingRightRem}rem`
      if (uiElement.element.paddingBottomRem)
        padding["paddingBottom"] = `${uiElement.element.paddingBottomRem}rem`
      if (uiElement.element.paddingLeftRem)
        padding["paddingLeft"] = `${uiElement.element.paddingLeftRem}rem`

      let styles = {...margins, ...padding}
      if (uiElement.element.type == "Container") {
          const direction = uiElement.element.direction == "row" ? "flex-row" : "flex-col";
          const justify = `justify-${uiElement.element.justify}`;
          const align = `items-${uiElement.element.align}`;
          styles = {...styles, "border-width": `${uiElement.element.borderWidthPx}px`}
          return (
              <div className={`flex ${direction} ${justify} ${align}`} style={styles}>
                  <WebsiteRender uiElement={uiElement.element.children || []} />
              </div>
          )
      } else if (uiElement.element.type == "Text") {
          return (
              <span style={styles}>
                  {uiElement.element.url == null ? uiElement.element.value : (<a href={uiElement.element.url} target="_blank">{uiElement.element.value}</a>)}
              </span>
          )
      } else if (uiElement.element.type == "Button") {
          return (
              <Button style={styles}>
                {uiElement.element.text}
              </Button>
          )
      } else if (uiElement.element.type == "TextInput" ) {
          return (
              <Input placeholder={uiElement.element.placeholder} style={styles}/>
          )
      } else if (uiElement.element.type == "Form") {
          return (
              <div>
                  <WebsiteRender uiElement={uiElement.element.children || []} />
              </div>
          )
      } else if (uiElement.element.type == "Image") {
        return (
          <img height={uiElement.element.url == null ? undefined : uiElement.element.heightPx} width={uiElement.element.url == null ? undefined : uiElement.element.widthPx} src={uiElement.element.url == null ? `https://placehold.co/${uiElement.element.widthPx}x${uiElement.element.heightPx}` : uiElement.element.url} />
        )
      }
    }) 
}

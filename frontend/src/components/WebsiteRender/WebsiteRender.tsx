import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Attribute, AttributeName, HTMLTag } from "./types";

export interface jsonHTML {
    type: HTMLTag;
    children: jsonHTML[];
    attributes: Attribute[];
}

export function WebsiteRender({ json }: { json: jsonHTML[] }) {
    console.log(json)
    return json.map((object) => {
        let parsedAttributes: Partial<Record<AttributeName, string>> = {}
        for (let attribute of object.attributes) {
            parsedAttributes[attribute.name] = attribute.value
        }
        if (object.type == "container") {
            return (
                <div>
                    <WebsiteRender json={object.children || []} />
                </div>
            )
        } else if (object.type == "text") {
            return (
                <Text as={"h3"}>
                    {parsedAttributes["text/text"]}
                </Text>
            )
        } else if (object.type == "button") {
            return (
                <Button>{parsedAttributes["button/text"]}</Button>
            )
        } else if (object.type == "textinput" ) {
            return (
                <Input placeholder={parsedAttributes["textinput/placeholder"]} />
            )
        } else if (object.type == "form") {
            return (
                <div>
                    <WebsiteRender json={object.children || []} />
                </div>
            )
        }
    })
}
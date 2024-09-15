import './App.css'
import { useState } from "react"
import { WebsiteRender } from './components/WebsiteRender/WebsiteRender'
import { Response } from './components/WebsiteRender/types'
import { UploadFile } from "./components/UploadFile";
import { Button } from './components/ui/button'

const response: Response = {
  "ui":{
    "root":{
       "element":{
          "type":"Container",
          "children":[
             {
                "element":{
                   "type":"Text",
                   "value":"Log in"
                }
             },
             {
                "element":{
                   "type":"Text",
                   "value":"Continue to Shopify"
                }
             },
             {
                "element":{
                   "type":"Button",
                   "text":"Log in to your Shopify Account"
                }
             },
             {
                "element":{
                   "type":"Text",
                   "value":"Don't have a Shopify account? "
                }
             },
             {
                "element":{
                   "type":"Button",
                   "text":"Start free trial"
                }
             },
             {
                "element":{
                   "type":"Container",
                   "children":[
                      {
                         "element":{
                            "type":"Text",
                            "value":"Help"
                         }
                      },
                      {
                         "element":{
                            "type":"Text",
                            "value":"Privacy"
                         }
                      },
                      {
                         "element":{
                            "type":"Text",
                            "value":"Terms"
                         }
                      }
                   ]
                }
             }
          ]
       }
    }
  }
}

function App() {
  const [isUploadPage, setIsUploadPage] = useState(true);
  return (
    <>
      <h1>Chameleon</h1>
      {isUploadPage ? <UploadFile /> : <WebsiteRender uiElement={response.ui.root} />}
      <Button style={{position: "fixed", bottom: 10, left: 10}} onClick={() => setIsUploadPage(!isUploadPage)}>Change pages</Button>
    </>
  );
}

export default App

import './App.css'
import { WebsiteRender } from './components/WebsiteRender/WebsiteRender'
import { Response } from './components/WebsiteRender/types'
import { UploadFile } from "./components/UploadFile";

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
  return (
    <>
      <h1>Chameleon</h1>
      <UploadFile />
      <WebsiteRender uiElement={response.ui.root} />
    </>
  );
}

export default App

import './App.css'
import { useState } from "react"
import { WebsiteRender } from './components/WebsiteRender/WebsiteRender'
import { Response } from './components/WebsiteRender/types'
import { UploadFile } from "./components/UploadFile";
import { Button } from './components/ui/button'
import logo from './resources/logo.png';
import leftdecor from './resources/leftdecor.png';
import rightdecor from './resources/rightdecor.png';

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
      <img
        src={logo}  
        style={{ width: 'auto', height: 'auto', position: 'absolute', left: '30%'}}  
      />
      <img
        src={leftdecor}  
        style={{ width: 'auto', height: 'auto', position: 'absolute', left: '0', top: '0', transform: 'scale(0.8)', transformOrigin: 'top left'}}  
      />
      <img
        src={rightdecor}  
        style={{ width: 'auto', height: 'auto', position: 'absolute', right: '0', bottom: '0', transform: 'scale(0.8)', transformOrigin: 'bottom right'}}  
      />
      <h1 style={{ color: 'black', fontFamily: 'Istok Web, sans-serif', fontSize: '90px',  marginLeft: '100px' }}>Chameleon</h1>
      {isUploadPage ? <UploadFile/> : <WebsiteRender uiElement={response.ui.root} />}
      <Button style={{background: "linear-gradient(90deg, #F9D7B7, #F2F7B6)", color: "black", bottom: 10, left: 10, border: "1px solid #F9B8A3", fontFamily: 'Istok Web', position: 'absolute'}} onClick={() => setIsUploadPage(!isUploadPage)}>Change Page</Button>
    </>
  );
}

export default App

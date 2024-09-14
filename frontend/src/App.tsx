import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { jsonHTML, WebsiteRender } from './components/WebsiteRender/WebsiteRender'
import { htmlTag } from './components/WebsiteRender/types'

const json: jsonHTML[] = [
  {
    "type": "container",
    "children": [
      {
        "type": "text",
        "children": [],
        "attributes": [
          {
            "name": "text/text",
            "value": "freestyle_barber700"
          }
        ]
      },
      {
        "type": "button",
        "children": [],
        "attributes": [
          {
            "name": "button/text",
            "value": "Follow"
          }
        ]
      },
      {
        "type": "text",
        "children": [],
        "attributes": [
          {
            "name": "text/text",
            "value": "3 posts    222 followers    850 following"
          }
        ]
      },
      {
        "type": "text",
        "children": [],
        "attributes": [
          {
            "name": "text/text",
            "value": "freestyle barber shop"
          }
        ]
      },
      {
        "type": "text",
        "children": [],
        "attributes": [
          {
            "name": "text/text",
            "value": "✂️ Freestyle Barber shop ✂️\n700 March Rd, Ottawa, ON K2K 2V9\n📞 Tel: 613-834-9936\n📱 Cell: 613-614-1980"
          }
        ]
      },
      {
        "type": "container",
        "children": [
          {
            "type": "button",
            "children": [],
            "attributes": [
              {
                "name": "button/text",
                "value": "POSTS"
              }
            ]
          },
          {
            "type": "button",
            "children": [],
            "attributes": [
              {
                "name": "button/text",
                "value": "TAGGED"
              }
            ]
          }
        ],
        "attributes": []
      }
    ],
    "attributes": []
  }
]

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WebsiteRender json={json} />
    </>
  )
}

export default App

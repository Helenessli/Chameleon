from fastapi import FastAPI, UploadFile
import enum
import base64
import pydantic
import typing
import os
from dotenv import load_dotenv
import openai 
import json
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI()
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UIType(str, enum.Enum):
    container = "container"
    button = "button"
    textinput = "textinput"
    form = "form"
    text = "text"

class AttributeName(str, enum.Enum):
    button_text = "button/text"
    textinput_placeholder = "textinput/placeholder"
    text_text = "text/text"

class Attribute(pydantic.BaseModel):
    name: AttributeName
    value: str

class UI(pydantic.BaseModel):
    type: UIType
    children: typing.List["UI"] 
    attributes: typing.List[Attribute]

UI.model_rebuild() # This is required to enable recursive types

class Response(pydantic.BaseModel):
    ui: UI

@app.get("/")
def generate_json():

    # Function to encode the image
    def encode_image(image_path):
      with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

    # Path to your image
    current_directory = os.path.dirname(__file__)
    image_path = os.path.join(current_directory, "..", "resources", "bird.jpg")

    # Getting the base64 string
    base64_image = encode_image(image_path)

    completion = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {
              "role": "system",
              "content": "You are a UI generator AI. Convert the user input into a UI."
            },
            {
              "role": "user",
              "content": [
                {
                  "type": "image_url",
                  "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image}"
                  }
                },
                {
                    "type": "text",
                    "text": "Using this image, generate JSON for a website featuring this product or theme."
                },
              ]
            },
        ],
        response_format=Response,
    )

    if completion and completion.choices:
        return json.loads(completion.choices[0].message.content)
        print(completion.choices[0])
        print(type(completion.choices[0]))
        return completion.choices[0]
    else:
        # Return error message with status code
        return {"error": "Failed to get response from OpenAI API", "status_code": 400}



@app.post("/upload-file")
def upload_file(file: UploadFile):
  print(file.filename)
  print(file.content_type)



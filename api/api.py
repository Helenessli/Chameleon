from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import base64
import pydantic
import typing
import os
from dotenv import load_dotenv
import openai
import time
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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

class Button(pydantic.BaseModel):
    type: typing.Literal["Button"]
    text: str

class Text(pydantic.BaseModel):
    type: typing.Literal["Text"]
    value: str

class Container(pydantic.BaseModel):
    type: typing.Literal["Container"]
    children: typing.List["UiElement"]

class TextInput(pydantic.BaseModel):
    type: typing.Literal["TextInput"]
    placeholder: str

class Form(pydantic.BaseModel):
    type: typing.Literal["Form"]
    children: typing.List["UiElement"]

class UiElement(pydantic.BaseModel):
    element: Button | Container | Text | TextInput | Form

class Ui(pydantic.BaseModel):
    root: UiElement

Ui.model_rebuild() # This is required to enable recursive types

class Response(pydantic.BaseModel):
    ui: Ui

@app.get("/")
def generate_json():

    # Function to encode the image
    def encode_image(image_path):
      with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

    # Path to your image
    current_directory = os.path.dirname(__file__)
    image_path = os.path.join(current_directory, "..", "resources", "shopify-login.png")

    # Getting the base64 string
    base64_image = encode_image(image_path)

    start = time.time()
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {
              "role": "system",
              "content": "You are a UI generator AI. Convert the user input into a UI. You should attempt to convert all of the input. If you encounter a sensitive image you must convert it to a placeholder image."
            },
            {
              "role": "user",
              "content": [
                {
                  "type": "image_url",
                  "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image}"
                  }
                }
              ]
            },
        ],
        response_format=Response,
    )
    end = time.time()

    logger.info(f"inference took {end - start} sec")
    if completion and completion.choices:
        return completion.choices[0].message.parsed
    else:
        # Return error message with status code
        return {"error": "Failed to get response from OpenAI API", "status_code": 400}


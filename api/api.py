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
from fastapi import FastAPI, UploadFile, File, Form
from pathlib import Path

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
    marginTopRem: int | None
    marginRightRem: int | None
    marginBottomRem: int | None
    marginLeftRem: int | None
    paddingTopRem: int | None
    paddingRightRem: int | None
    paddingBottomRem: int | None
    paddingLeftRem: int | None


class Text(pydantic.BaseModel):
    type: typing.Literal["Text"]
    value: str
    marginTopRem: int | None
    marginRightRem: int | None
    marginBottomRem: int | None
    marginLeftRem: int | None
    paddingTopRem: int | None
    paddingRightRem: int | None
    paddingBottomRem: int | None
    paddingLeftRem: int | None


class Container(pydantic.BaseModel):
    type: typing.Literal["Container"]
    children: typing.List["UiElement"]
    direction: typing.Literal["row"] | typing.Literal["col"]
    justify: (
        typing.Literal["start"]
        | typing.Literal["end"]
        | typing.Literal["center"]
        | typing.Literal["between"]
        | typing.Literal["around"]
    )
    align: (
        typing.Literal["start"]
        | typing.Literal["end"]
        | typing.Literal["center"]
        | typing.Literal["stretch"]
    )
    borderWidthPx: int | None
    marginTopRem: int | None
    marginRightRem: int | None
    marginBottomRem: int | None
    marginLeftRem: int | None
    paddingTopRem: int | None
    paddingRightRem: int | None
    paddingBottomRem: int | None
    paddingLeftRem: int | None


class TextInput(pydantic.BaseModel):
    type: typing.Literal["TextInput"]
    placeholder: str
    marginTopRem: int | None
    marginRightRem: int | None
    marginBottomRem: int | None
    marginLeftRem: int | None
    paddingTopRem: int | None
    paddingRightRem: int | None
    paddingBottomRem: int | None
    paddingLeftRem: int | None


class FormClass(pydantic.BaseModel):
    type: typing.Literal["Form"]
    children: typing.List["UiElement"]
    marginTopRem: int | None
    marginRightRem: int | None
    marginBottomRem: int | None
    marginLeftRem: int | None
    paddingTopRem: int | None
    paddingRightRem: int | None
    paddingBottomRem: int | None
    paddingLeftRem: int | None


class Image(pydantic.BaseModel):
    type: typing.Literal["Image"]
    url: str | None
    widthPx: int
    heightPx: int
    marginTopRem: int | None
    marginRightRem: int | None
    marginBottomRem: int | None
    marginLeftRem: int | None
    paddingTopRem: int | None
    paddingRightRem: int | None
    paddingBottomRem: int | None
    paddingLeftRem: int | None


class UiElement(pydantic.BaseModel):
    element: Button | Container | Text | TextInput | FormClass | Image


class Ui(pydantic.BaseModel):
    root: UiElement


Ui.model_rebuild()  # This is required to enable recursive types


class Response(pydantic.BaseModel):
    ui: Ui


@app.post("/upload-file")
async def generate_json(text: str = Form(...), file: UploadFile = File(...)):
    # Function to encode the image
    def encode_image(image_path):
        try:
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode("utf-8")
        except OSError:
            return ""

    # Path to your image
    current_directory = os.path.dirname(__file__)
    UPLOAD_DIR = os.path.join(current_directory, "temp")
    image_path = os.path.join(UPLOAD_DIR, file.filename)  # Get the file path

    with open(image_path, "wb") as f:
        f.write(await file.read())  # Save the uploaded file
    print(f"File stored at: {image_path}")

    # Getting the base64 string
    base64_image = encode_image(image_path)
    messages = [
        {
            "role": "system",
            "content": "You are a UI generator AI. Convert the user input into a UI. You should include all borders and mimic the exact spacing. Unless explicitly given an image url, you should leave image urls null.",
        },
    ]
    if base64_image:
        messages.append(
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                    {"type": "text", "text": text},
                ],
            },
        )
    else:
        messages.append(
            {"role": "user", "content": text},
        )
    start = time.time()
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        temperature=0.7,
        messages=[
            {
                "role": "system",
                "content": "You are a UI generator AI. Convert the user input into a UI. You should include all borders and mimic the exact spacing. Unless explicitly given an image url, you should leave image urls null.",
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    }
                ],
            },
        ],
        response_format=Response,
    )
    end = time.time()

    logger.info(f"inference took {end - start} sec")
    if completion and completion.choices:
        print(completion.choices[0].message.parsed)
        return completion.choices[0].message.parsed
    else:
        # Return error message with status code
        return {"error": "Failed to get response from OpenAI API", "status_code": 400}

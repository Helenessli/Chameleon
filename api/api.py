import base64
import requests
import os
from dotenv import load_dotenv
import openai  
from typing import Union
from fastapi import FastAPI

# Load environment variables
load_dotenv()

app = FastAPI()

@app.get("/")
def generate_json():
    # Access OpenAI API key
    api_key = os.getenv("OPENAI_API_KEY")

    # Function to encode the image
    def encode_image(image_path):
      with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

    # Path to your image
    current_directory = os.path.dirname(__file__)
    image_path = os.path.join(current_directory, "bird.jpg")

    # Getting the base64 string
    base64_image = encode_image(image_path)

    headers = {
      "Content-Type": "application/json",
      "Authorization": f"Bearer {api_key}"
    }

    payload = {
      "model": "gpt-4o-mini",
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "What’s in this image?"
            },
            {
              "type": "image_url",
              "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
              }
            }
          ]
        }
      ],
      "max_tokens": 300
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    if response.status_code == 200:
        response_json = response.json()
        # Extract the content from the response
        content = response_json.get("choices", [{}])[0].get("message", {}).get("content", "No content available")
        return {"content": content}
    else:
        # Return error message with status code
        return {"error": "Failed to get response from OpenAI API", "status_code": response.status_code}



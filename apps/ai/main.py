import json
from fastapi.responses import StreamingResponse
import uvicorn
import os

from typing import AsyncGenerator, List, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

# Loading environment variables
load_dotenv()

# Lang Smith Analytics
os.environ["LANGCHAIN_TRACKING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")  # type: ignore


# FastAPI app
app = FastAPI(
    title="Void Assistant Server",
    version="1.0",
    description="Void Assistant | Local AI Server",
)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this to specific domains if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Request model for type safety
class PromptRequest(BaseModel):
    messages: List[Dict[str, str]] 


# Ollama LLM initialization
llm = Ollama(model="llama3.2")
output_parser = StrOutputParser()


# Function to dynamically create a prompt from the messages
def build_prompt_from_messages(messages: List[Dict[str, str]]) -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages(
        [(msg['role'], msg['content']) for msg in messages]
    )


# Route for the assistant
@app.post("/assistant")
async def assistant(request: PromptRequest):
    try:
        # Enhance the prompt dynamically based on the task type
        prompt = build_prompt_from_messages(request.messages)
        chain = prompt | llm | output_parser
        
        # Streaming generator function for chain output
        async def generate_response() -> AsyncGenerator[str, None]:
            for part in chain.stream({"message": request.messages}):
                # Convert the dictionary to a JSON string and yield it
                yield part

        # Use StreamingResponse to stream the generated response incrementally
        return StreamingResponse(generate_response(), media_type="application/json")

    except Exception as e:
        # Handle errors with appropriate status code and message
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)

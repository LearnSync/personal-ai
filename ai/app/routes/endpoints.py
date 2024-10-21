from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.request import PromptRequest
from app.services.ai import AIService


router = APIRouter()

@router.post("/generate")
async def generate(request: "PromptRequest"):
    try:
        # Streaming generator function for chain output
        async def generate_response() -> StreamingResponse:
            async for part in AIService.generate_ai_response(
                    messages=request.messages,
                    model=request.model,
                    api_key=request.api_key
            ):
                yield part

        return StreamingResponse(generate_response(), media_type="application/json")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")
import asyncio

from fastapi import APIRouter
from fastapi import HTTPException
from fastapi.responses import StreamingResponse

from typing import AsyncGenerator
from app.services.ai import AIService
from app.models.request import ChatRequest
# from app.database.chat import ChatSession, ChatMessage

# Initializing Router
router = APIRouter()


# TODO: Implementation is Pending
@router.post("/generate")
async def generate(request: ChatRequest):
    try:
        messages = request.messages,
        model = request.model,
        variant = request.variant,
        api_key = request.api_key # This will be encrypted so we need to decrypt it here
        decoded_api_key = api_key # TODO: Decode the key here

        # Streaming generator function for chain output
        async def generate_response() -> AsyncGenerator[str, None]:
            for part in AIService.generate_ai_response(
                messages=messages[0],
                model=model[0],
                variant=variant[0],
                api_key=decoded_api_key
            ):
                print(part)
                await asyncio.sleep(0.01)
                yield part

        return StreamingResponse(generate_response(), media_type="application/json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

# @router.get("/chat/sessions")
# def get_chat_sessions(chat_session_id: int, archived: bool = False, favorite: bool = False) -> List[ChatSession]:
#     """
#     Fetch all chat sessions for a user, optionally filtering by archived or favorite status.
#     """
#     pass
#
# @router.get("/chat/sessions/{session_id}")
# def get_conversation(session_id: int) -> List[ChatMessage]:
#     """
#     Fetch all chat messages for a given session.
#     """
#     pass

import re
from datetime import datetime
from typing import Optional, AsyncGenerator

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from app.database.db import get_db
from app.database.schema import ChatSession, ChatMessage
from app.enums.ai import EAIModel
from app.models.chat_model import ChatSessionResponse, ChatMessageResponse, UpdateChatSessionRequest
from app.models.request import ChatRequest, ChatRegister
from app.services.ai import AIService


# Initializing Router
router = APIRouter()


@router.post("/generate")
async def generate(request: ChatRequest):
    """
    Generate an AI response for a chat session, save the full response, and stream it back to the client.
    """
    try:
        messages = request.messages
        model = request.model
        variant = request.variant
        api_key = request.api_key

        # Validate API key requirement for external models
        if model != EAIModel.LOCAL and not api_key:
            raise HTTPException(status_code=403, detail="API Key is required for external models")

        async def generate_response() -> AsyncGenerator[str, None]:
            """
            Async generator to yield response chunks for streaming.
            """
            for chunk in AIService.generate_ai_response(
                model=model,
                variant=variant,
                messages=messages,
                api_key=api_key
            ):
                yield chunk

        return StreamingResponse(
            generate_response(),
            media_type="application/json",
            headers={"Transfer-Encoding": "chunked"}
        )

    except HTTPException as http_ex:
        # Propagate HTTP exceptions
        print(f"Unexpected HTTP Error: {http_ex}")
        raise http_ex
    except Exception as e:
        # Log unexpected exceptions and return a generic error to the client
        print(f"Unexpected Error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


@router.post("/register")
async def register_chat(request: ChatRegister, db: Session = Depends(get_db)):
    try:
        # Extract request fields
        session_id = request.session_id
        session_name = request.session_name
        messages = request.messages
        model = request.model
        variant = request.variant
        api_key = request.api_key

        # Check for API key if not using local model
        if model != EAIModel.LOCAL and not api_key:
            raise HTTPException(status_code=403, detail="API Key is required for non-local models.")

        # Retrieve or create a new ChatSession
        chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        if not chat_session:
            chat_session = ChatSession(
                session_name=session_name or "Unknown",
                session_id=session_id,
                archived=False,
                favorite=False,
                created_at=datetime.now(),
            )
            db.add(chat_session)
            db.commit()
            db.refresh(chat_session)

        # Title generation logic for messages < 3
        if len(messages) < 3:
            for idx, message in messages:  # Check only the first two messages
                if message.role == "user":
                    # Extract text within quotes as title
                    match = re.search(r'"(.*?)"', message.content)
                    if match:
                        chat_session.session_name = match.group(1)
                        db.commit()
                        break

        # Title generation logic for messages >= 3
        if len(messages) >= 3:
            chat_title = await AIService.generate_title(
                model=model,
                variant=variant,
                messages=messages,
                api_key=api_key
            )
            if chat_title:
                chat_session.session_name = chat_title
                db.commit()

        # Add or update user messages in the database
        for message in messages:
            existing_message = db.query(ChatMessage).filter(
                ChatMessage.session_id == session_id,
                ChatMessage.message_id == message.message_id
            ).first()

            if not existing_message:
                new_message = ChatMessage(
                    session_id=session_id,
                    message_id=message.message_id,
                    content=message.content,
                    role=message.role,
                    variant=variant,
                    model=model,
                    created_at=datetime.now(),
                )
                db.add(new_message)
        db.commit()

        # Return success response
        return {"success": True, "message": "Chat successfully registered or updated.", "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@router.get("/chat/{session_id}", response_model=ChatSessionResponse)
def get_conversation(session_id: str, db: Session = Depends(get_db)):
    """
    Fetch all chat messages for a given session.
    """
    try:
        # Fetch the chat session
        chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()

        if not chat_session:
            return JSONResponse({
                "success":False, "message": f"Chat session with ID {session_id} not found.", "data": chat_session
            })

        # Fetch all messages for the session
        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at)
            .all()
        )

        # Construct the response
        response = ChatSessionResponse(
            session_id=chat_session.session_id,
            session_name=chat_session.session_name,
            archived=chat_session.archived,
            favorite=chat_session.favorite,
            created_at=chat_session.created_at,
            messages=[
                ChatMessageResponse(
                    message_id=message.message_id,
                    role=message.role,
                    content=message.content,
                )
                for message in messages
            ]
        )
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching conversation: {str(e)}")


@router.get("/chat/all/")
def get_chat_sessions(
    archived: bool = False,
    favorite: bool = False,
    start_date: Optional[datetime] = Query(None, description="Filter by start date"),
    end_date: Optional[datetime] = Query(None, description="Filter by end date"),
    page: int = Query(1, description="Page number, starts from 1"),
    limit: int = Query(10, description="Number of records to return"),
    db: Session = Depends(get_db)
):
    """
    Fetch all chat sessions, optionally filtered by archived or favourite status, and within a date range.
    """
    try:
        if page < 1:
            raise HTTPException(status_code=400, detail="Page number must be 1 or greater.")
        if limit < 1:
            raise HTTPException(status_code=400, detail="Limit must be 1 or greater.")

        offset = (page - 1) * limit

        # Base query
        query = db.query(ChatSession)
        if archived:
            query = query.filter(ChatSession.archived == True)
        if favorite:
            query = query.filter(ChatSession.favorite == True)
        if start_date:
            query = query.filter(ChatSession.created_at >= start_date)
        if end_date:
            query = query.filter(ChatSession.created_at <= end_date)

        # Calculate total records for pagination
        total_records = query.count()

        # Fetch paginated results
        sessions = query.order_by(ChatSession.created_at)\
                        .offset(offset)\
                        .limit(limit)\
                        .all()

        # Calculate total pages
        total_pages = (total_records + limit - 1) // limit  # Ceiling division for total pages

        return {
            "success": True,
            "data": sessions,
            "message": "Successfully fetched chat sessions",
            "nextPage": page + 1 if page < total_pages else None,
            "totalPage": total_pages,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat sessions: {str(e)}")


@router.patch("/chat/{session_id}")
def update_chat_session(
    session_id: str,
    request: UpdateChatSessionRequest,
    db: Session = Depends(get_db)
):
    """
    Update properties of a chat session (rename, archive, favorite).
    """
    try:
        chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        rename = request.rename
        archived = request.archived
        favorite = request.favorite

        if not chat_session:
            raise HTTPException(status_code=404, detail=f"Chat session with ID {session_id} not found.")

        # Apply updates if provided
        if rename is not None:
            chat_session.session_name = rename
        if archived is not None:
            chat_session.archived = archived
        if favorite is not None:
            chat_session.favorite = favorite

        db.commit()
        db.refresh(chat_session)

        return {
            "detail": "Chat session updated successfully.",
            "success": True,
            "session_id": session_id,
            "updated_fields": {
                "session_name": chat_session.session_name,
                "archived": chat_session.archived,
                "favorite": chat_session.favorite
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating chat session: {str(e)}")


@router.delete("/chat/{session_id}")
def delete_chat_session(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete a chat session by its ID.
    """
    try:
        chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()

        if not chat_session:
            raise HTTPException(status_code=404, detail=f"Chat session with ID {session_id} not found.")

        db.delete(chat_session)
        db.commit()

        return {"detail": "Chat session deleted successfully.", "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting chat session: {str(e)}")
from datetime import datetime
from typing import List, Optional, Type, Generator

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from app.database.db import get_db
from app.database.schema import ChatSession, ChatMessage
from app.enums.ai import EAIModel
from app.enums.chat import ERole
from app.models.chat_model import ChatSessionResponse, ChatMessageResponse, UpdateChatSessionRequest
from app.models.request import ChatRequest
from app.services.ai import AIService

# Initializing Router
router = APIRouter()


@router.post("/generate")
async def generate(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Generate an AI response for a chat session, save the full response, and stream it back to the client.
    """
    try:
        session_id = request.session_id
        messages = request.messages
        model = request.model
        response_message_id = request.response_message_id
        variant = request.variant
        api_key = request.api_key

        if model != EAIModel.LOCAL and not api_key:
            raise HTTPException(status_code=403, detail=f"API Key is required for")

        # Check if session exists or create a new one
        chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()

        if not chat_session:
            chat_session = ChatSession(
                session_name=request.session_name or "Unknown",
                session_id=session_id,
                archived=False,
                favorite=False,
                created_at=datetime.now(),
            )
            db.add(chat_session)
            db.commit()
            db.refresh(chat_session)

        # Add or Update User Messages in the Database
        for message in messages:
            existing_messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).all()

            # Find if the current message already exists in the database
            existing_message = next((m for m in existing_messages if m.message_id == message.message_id), None)

            if not existing_message:
                # Add new message
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

        # This is to manage the response into the Database
        async def generate_response() -> Generator[str, None, None]:
            full_text = ""
            try:
                for chunk in AIService.generate_ai_response(
                        messages=messages,
                        model=model,
                        variant=variant,
                        api_key=api_key
                ):
                    full_text += chunk
                    yield chunk

                # Save the full response to the database after streaming is complete
                new_response_message = ChatMessage(
                    session_id=session_id,
                    message_id=response_message_id,
                    role=ERole.ASSISTANT,
                    content=full_text,
                    model=model,
                    variant=variant,
                    created_at=datetime.now(),
                )
                db.add(new_response_message)
                db.commit()
            except Exception as e:
                print(f"Error during response streaming: {e}")
                raise

        return StreamingResponse(generate_response(), media_type="text/plain")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


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
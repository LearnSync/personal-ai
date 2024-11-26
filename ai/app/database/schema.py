from datetime import datetime
from typing import List, Optional

from pygments.lexer import default
from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import (
    relationship,
    Mapped,
    mapped_column
)

from app.enums.chat import ERole

Base = declarative_base()

class AIModel(Base):
    """
    Represents an AI Model configuration, including API credentials and operational modes.
    """
    __tablename__ = "ai_models"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    api_key: Mapped[str] = mapped_column(nullable=False)
    model: Mapped[str] = mapped_column(nullable=False)
    variant: Mapped[str] = mapped_column(nullable=False)
    max_tokens: Mapped[str] = mapped_column(default="2048")  # Defaults to `2048`


class LocalModel(Base):
    """
    Represents a locally available AI model.
    """
    __tablename__ = "local_models"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    model: Mapped[str] = mapped_column(nullable=False)


class APIConfiguration(Base):
    """
    Represents configuration settings for different API services.
    """
    __tablename__ = "api_configurations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)


class AppSettings(Base):
    """
    Represents application-wide settings and preferences.
    """
    __tablename__ = "app_settings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    app_name: Mapped[str] = mapped_column(nullable=False)
    theme: Mapped[str] = mapped_column(nullable=False)
    language: Mapped[str] = mapped_column(nullable=False)
    version: Mapped[str] = mapped_column(nullable=False)
    enable_notifications: Mapped[bool] = mapped_column(default=True)


class ChatSession(Base):
    """
    Represents a chat session with associated metadata.
    """
    __tablename__ = "chat_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    session_name: Mapped[str] = mapped_column(default="Unknown")
    session_id: Mapped[str] = mapped_column(unique=True, nullable=False)
    archived: Mapped[bool] = mapped_column(default=False)
    favorite: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Relationship to ChatMessage
    messages: Mapped[List["ChatMessage"]] = relationship("ChatMessage", back_populates="chat_session")

    def __repr__(self):
        return f"ChatSession(id={self.id}, session_name={self.session_name}, session_id={self.session_id}, archived={self.archived}, favorite={self.favorite}, created_at={self.created_at})"


class ChatMessage(Base):
    """
    Represents individual chat messages within a session.
    """
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("chat_sessions.id"), nullable=False)
    message_id: Mapped[str] = mapped_column(unique=True, nullable=False)
    role: Mapped[ERole] = mapped_column(nullable=ERole.ASSISTANT)
    content: Mapped[str] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)

    # Back-reference to the ChatSession
    chat_session: Mapped["ChatSession"] = relationship("ChatSession", back_populates="messages")


class Document(Base):
    """
    Represents a document uploaded and associated with a chat session.
    """
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("chat_sessions.id"), nullable=False)
    file_path: Mapped[str] = mapped_column(nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(default=datetime.now)
    embedding: Mapped[bytes] = mapped_column()

    # Relationship to ChatSession
    chat_session: Mapped["ChatSession"] = relationship("ChatSession")


class BackupConfiguration(Base):
    """
    Represents backup configurations and scheduling details for various cloud services.
    """
    __tablename__ = "backup_configurations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    schedule_frequency: Mapped[str] = mapped_column(nullable=False)  # E.g., "daily", "weekly"
    last_backup: Mapped[Optional[datetime]]
    next_backup: Mapped[Optional[datetime]]
    enabled_service: Mapped[str] = mapped_column(default="google_drive")


class Backup(Base):
    """
    Represents an individual backup instance with details.
    """
    __tablename__ = "backups"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    configuration_id: Mapped[int] = mapped_column(ForeignKey("backup_configurations.id"), nullable=False)
    backup_time: Mapped[datetime] = mapped_column(default=datetime.now)
    storage_service: Mapped[str] = mapped_column(nullable=False)  # E.g., "google_drive"
    file_path: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(nullable=False)  # E.g., "completed"

    # Relationship to BackupConfiguration
    configuration: Mapped["BackupConfiguration"] = relationship("BackupConfiguration")

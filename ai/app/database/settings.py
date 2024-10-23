from objectbox.model import Entity, Id

class GeneralSettings(Entity):
    id: int = Id()  # Auto-incrementing primary key
    app_name: str  # Application name
    theme: str  # Dark/Light theme selection
    language: str  # Default language (e.g., "en", "fr")
    version: str  # Application version
    allow_notifications: bool  # Enable or disable notifications

class UserSettings(Entity):
    id: int = Id()  # Auto-incrementing primary key
    user_id: int  # Reference to the user
    preferred_language: str  # User's preferred language
    receive_emails: bool  # Opt-in for receiving emails
    receive_push_notifications: bool  # Opt-in for receiving push notifications
    default_model: str  # Default model for AI interaction (e.g., "gpt-4", "gpt-3.5")

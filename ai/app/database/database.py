from langchain_objectbox.vectorstores import ObjectBox
from app.database.chat import ChatSession, ChatMessage

def init_db():
    # ObjectBox setup
    store = ObjectBox([ChatSession, ChatMessage])
    return store

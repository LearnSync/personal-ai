from typing import List, Dict, Optional
from langchain_core.prompts import ChatPromptTemplate

from app.enums.topic import Topic


def build_prompt_from_messages(
    messages: List[Dict[str, str]], topic: Optional[Topic] = None
) -> ChatPromptTemplate:
    """
    Build a ChatPromptTemplate from a list of messages, optionally tailored to a specific topic.

    Args:
        messages (List[Dict[str, str]]): A list of dictionaries, each containing a role ('role') and content ('content').
        topic (Optional[Topic]): An optional topic to contextualize the prompt.

    Returns:
        ChatPromptTemplate: A ChatPromptTemplate object created from the messages.
    """
    # Base messages converted into tuples
    base_messages = [(msg["role"], msg["content"]) for msg in messages]

    # Add a topic-specific message if a topic is provided
    if topic:
        topic_message = ("system", f"This is a {topic.value} related conversation.")
        base_messages.insert(0, topic_message)

    # Build the ChatPromptTemplate from messages
    return ChatPromptTemplate.from_messages(base_messages)
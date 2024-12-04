from typing import List, Dict, Optional, Union

from langchain_core.prompts import ChatPromptTemplate

from app.enums.topic import ETopic
from app.models.chat_model import ChatMessageResponse


def build_prompt_from_messages(
    messages: List[Union[ChatMessageResponse, Dict[str, str]]],
    topic: Optional[ETopic] = None
) -> ChatPromptTemplate:
    """
    Build a ChatPromptTemplate from a list of messages, optionally tailored to a specific topic.

    Args:
        messages (List[Union[ChatMessageResponse, Dict[str, str]]]): A list of chat messages,
            either as `ChatMessageResponse` objects or dictionaries with 'role' and 'content'.
        topic (Optional[ETopic]): An optional topic to contextualise the prompt.

    Returns:
        ChatPromptTemplate: A ChatPromptTemplate object created from the messages.

    Raises:
        ValueError: If a message does not have the required attributes or keys.
    """
    base_messages = []

    # Process messages dynamically based on type
    for msg in messages:
        if isinstance(msg, ChatMessageResponse):
            base_messages.append((msg.role, msg.content))
        elif isinstance(msg, dict) and 'role' in msg and 'content' in msg:
            base_messages.append((msg['role'], msg['content']))
        else:
            raise ValueError("Each message must be either a `ChatMessageResponse` object or a dictionary with 'role' and 'content'.")

    # Add a topic-specific message if provided
    if topic == ETopic.TITLE:
        base_messages.insert(0, ("system", f"Create a concise, 3-4 word title that accurately summarizes the following conversation"))
    elif topic:
        base_messages.insert(0, ("system", f"This is a {topic.value} related conversation."))

    # Build the ChatPromptTemplate
    return ChatPromptTemplate.from_messages(base_messages)
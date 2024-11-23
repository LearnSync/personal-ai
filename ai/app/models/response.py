"""
This module defines structured output models for LLM responses.
Each model corresponds to a specific type of response, such as coding, general output,
language improvement, or interactions with PDFs.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Union

class CodeResponse(BaseModel):
    """
    Represents the output structure for a code review or coding-related response.
    """
    file_name: str = Field(..., description="The name of the file the code belongs to.")
    code_snippet: str = Field(..., description="The actual code snippet provided in the response.")
    explanation: str = Field(..., description="Explanation or reasoning behind the code snippet.")
    suggestions: Optional[List[str]] = Field(
        None, description="List of suggestions or improvements for the provided code."
    )

class GeneralResponse(BaseModel):
    """
    Represents the output structure for a general response.
    """
    text: str = Field(..., description="Text content of the response.")
    images: Optional[List[str]] = Field(
        None, description="List of URLs pointing to images related to the response."
    )
    website_urls: Optional[List[str]] = Field(
        None, description="List of website URLs referenced in the response."
    )
    youtube_links: Optional[List[str]] = Field(
        None, description="List of YouTube video links referenced in the response."
    )

class LanguageImprovement(BaseModel):
    """
    Represents the output structure for language improvement responses.
    """
    original_text: str = Field(..., description="The original text provided for improvement.")
    improved_text: str = Field(..., description="The improved version of the original text.")
    suggestions: Optional[List[str]] = Field(
        None, description="Suggestions for further improvements."
    )
    grammar_score: Optional[float] = Field(
        None, description="A score representing the grammatical quality of the text (0-1 scale)."
    )

class PDFInteraction(BaseModel):
    """
    Represents the output structure for interactions with PDFs.
    """
    document_name: str = Field(..., description="The name of the PDF document.")
    extracted_text: str = Field(..., description="The text extracted from the PDF.")
    summary: Optional[str] = Field(
        None, description="A summary of the extracted text, if applicable."
    )
    questions_and_answers: Optional[List[dict]] = Field(
        None, description="Questions and answers based on the extracted text."
    )

class LLMResponse(BaseModel):
    """
    Unified model for LLM responses. Contains one of the specific response types.
    """
    model_type: str = Field(
        ..., description="Type of the response model (e.g., 'CodeResponse', 'GeneralResponse', 'LanguageImprovement', 'PDFInteraction')."
    )
    response: Union[CodeResponse, GeneralResponse, LanguageImprovement, PDFInteraction] = Field(
        ..., description="The actual response content based on the model type."
    )

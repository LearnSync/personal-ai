import enum

class EAIModel(str, enum.Enum):
    """Enum representing different AI providers."""
    ANTHROPIC = "anthropic",
    GREPTILE = "greptile",
    GEMINI = "gemini",
    OPENAI = "openai",
    OLLAMA = "ollama",
    LOCAL = "local"

    def __str__(self):
        return self.value

class EAIEmbedding(str, enum.Enum):
    # OLLAMA
    OLLAMA_NOMIC = "nomic-embed-text"
    OLLAMA_MXBAI = "mxbai-embed-large"

    # OPENAI
    OPENAI_TEXT_EMBEDDING_3_LARGE = "text-embedding-3-large"
    OPENAI_TEXT_EMBEDDING_3_SMALL = "text-embedding-3-small"
    OPENAI_TEXT_EMBEDDING_ADA_002 = "text-embedding-ada-002"

    # GEMINI
    GEMINI_TEXT_EMBEDDING_004 = "text-embedding-004"


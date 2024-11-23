import enum

class AIProvider(enum.Enum):
    """Enum representing different AI providers."""
    ANTHROPIC = "anthropic",
    GREPTILE = "greptile",
    GEMINI = "gemini",
    OPENAI = "openai",
    OLLAMA = "llama",

    def __str__(self):
        return self.value

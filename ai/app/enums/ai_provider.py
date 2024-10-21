import enum

class AIProvider(enum.Enum):
    """Enum representing different AI providers."""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"  # aka, Claud
    LLAMA = "llama"
    LOCAL = "local"

    def __str__(self):
        return self.value
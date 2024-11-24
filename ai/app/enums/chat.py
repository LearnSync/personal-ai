import enum


class ERole(enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"

    def __str__(self):
        return self.value


class EChatHistoryTime(enum.Enum):
    TODAY = "today",
    YESTERDAY = "yesterday",
    PAST_7_DAYS = "week",
    PAST_30_DAYS = "month",

    def __str__(self):
        return self.value
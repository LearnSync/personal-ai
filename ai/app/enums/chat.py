import enum


class ERole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"

    def __str__(self):
        return self.value


class EChatHistoryTime(str, enum.Enum):
    TODAY = "today",
    YESTERDAY = "yesterday",
    PAST_7_DAYS = "week",
    PAST_30_DAYS = "month",

    def __str__(self):
        return self.value
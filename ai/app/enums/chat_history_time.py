import enum

class ChatHistoryTime(enum.Enum):
    TODAY = "today",
    YESTERDAY = "yesterday",
    PAST_7_DAYS = "week",
    PAST_30_DAYS = "month",

    def __str__(self):
        return self.value
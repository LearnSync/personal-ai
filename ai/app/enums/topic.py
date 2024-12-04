import enum

class ETopic(str, enum.Enum):
    """
    Enum representing a wide range of topics for LLM interaction.
    """
    # GENERAL UTILITIES
    TITLE = "title"
    SUMMARIZE = "summarise"

    # Programming & Technology
    CODE = "code"  # Code generation, debugging, and reviews
    SOFTWARE = "software"  # Software development, architecture, or tools
    DEVOPS = "devops"  # CI/CD, cloud infrastructure, and automation
    DATABASE = "database"  # SQL, NoSQL, and data modeling
    CRYPTOCURRENCY = "cryptocurrency"  # Blockchain, crypto wallets, tokens

    # Data Science & AI
    MACHINE_LEARNING = "machine_learning"  # ML models, pipelines, and datasets
    AI = "ai"  # Artificial Intelligence-related discussions
    DATA_ANALYSIS = "data_analysis"  # Data processing, visualization, and insights
    STATISTICS = "statistics"  # Probability, hypothesis testing, etc.

    # Science & Research
    BIOLOGY = "biology"  # Genetics, cell biology, etc.
    CHEMISTRY = "chemistry"  # Organic, inorganic, analytical, etc.
    PHYSICS = "physics"  # Mechanics, quantum physics, etc.
    MATHEMATICS = "mathematics"  # Algebra, calculus, number theory, etc.
    ENVIRONMENT = "environment"  # Climate, ecology, and sustainability

    # Finance & Business
    FINANCE = "finance"  # Investment, accounting, and economic analysis
    BUSINESS = "business"  # Entrepreneurship, management, and operations
    MARKETING = "marketing"  # SEO, branding, and campaigns

    # Language & Communication
    LANGUAGE = "language"  # Language improvement and translations
    WRITING = "writing"  # Creative writing, copywriting, and editing
    LITERATURE = "literature"  # Analysis of novels, poetry, etc.
    TRANSLATION = "translation"  # Text translation across languages

    # General Knowledge
    HISTORY = "history"  # Historical events, analysis, and timelines
    GEOGRAPHY = "geography"  # Maps, locations, and cultures
    GENERAL = "general"  # General-purpose queries
    EDUCATION = "education"  # Learning resources, courses, and pedagogy

    # Media & Entertainment
    IMAGE = "image"  # Image generation and analysis
    VIDEO = "video"  # Video content, editing, and analysis
    MUSIC = "music"  # Composition, analysis, and recommendations
    ART = "art"  # Painting, drawing, or digital art discussions
    FILM = "film"  # Movies, reviews, and filmmaking

    # File & Document Interaction
    FILE = "file"  # TXT, JSON, XML, etc.
    PDF = "pdf"  # Chat and interaction with PDFs
    SPREADSHEET = "spreadsheet"  # Excel, Google Sheets, data processing

    # Specialized Topics
    LEGAL = "legal"  # Contracts, laws, and regulations
    MEDICAL = "medical"  # Health, diseases, and medical advice
    PSYCHOLOGY = "psychology"  # Mental health, theories, and practices
    PHILOSOPHY = "philosophy"  # Ethical dilemmas, theories, and debates

    # Miscellaneous
    MATH = "math"  # General math problems and solutions
    SPORTS = "sports"  # Analysis, trivia, and recommendations
    TRAVEL = "travel"  # Destinations, itineraries, and tips
    DIY = "diy"  # Home improvement and crafting projects
    FOOD = "food"  # Recipes, nutrition, and culinary discussions

    # Custom Domains
    CUSTOM = "custom"  # User-defined or application-specific topics

    def __str__(self):
        return self.value
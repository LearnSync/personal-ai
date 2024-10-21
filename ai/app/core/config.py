from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()


class Config(BaseSettings):
    pass

config = Config()

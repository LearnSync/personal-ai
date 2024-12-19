from fastapi import APIRouter

from app.models.api_config_request import ApiConfigRequest

# Initializing Router
router = APIRouter()


@router.post("/api_config")
async def configure_api(request: ApiConfigRequest):
    """
    Endpoint to configure API providers.
    """
    return {"message": "Configuration saved successfully"}


@router.get("/api_config")
async def get_api_config():
    """
    Endpoint to get api config
    """
    return {"message": "Successfully get api config data"}
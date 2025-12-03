"""File upload router."""

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.application.dtos.response import APIResponse
from app.infrastructure.storage import s3_service

router = APIRouter(prefix="/uploads", tags=["Uploads"])

# Tipos de archivo permitidos
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/recipe-image", response_model=APIResponse)
async def upload_recipe_image(file: UploadFile = File(...)):
    """
    Upload a recipe image to S3.
    
    Returns the public URL of the uploaded image.
    """
    # Validar tipo de archivo
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de archivo no permitido. Usa: {', '.join(ALLOWED_IMAGE_TYPES)}",
        )

    # Leer contenido
    content = await file.read()

    # Validar tamaño
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Archivo muy grande. Máximo: {MAX_FILE_SIZE // (1024*1024)} MB",
        )

    # Subir a S3
    url = s3_service.upload_recipe_image(
        file_content=content,
        original_filename=file.filename or "image.jpg",
        content_type=file.content_type or "image/jpeg",
    )

    if not url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al subir la imagen",
        )

    return APIResponse(
        success=True,
        message="Imagen subida exitosamente",
        data={"url": url},
    )


@router.post("/avatar", response_model=APIResponse)
async def upload_avatar(file: UploadFile = File(...)):
    """
    Upload a user avatar to S3.
    
    Returns the public URL of the uploaded image.
    """
    # Validar tipo de archivo
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de archivo no permitido. Usa: {', '.join(ALLOWED_IMAGE_TYPES)}",
        )

    # Leer contenido
    content = await file.read()

    # Validar tamaño (avatares más pequeños)
    max_avatar_size = 5 * 1024 * 1024  # 5 MB
    if len(content) > max_avatar_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Archivo muy grande. Máximo: {max_avatar_size // (1024*1024)} MB",
        )

    # Subir a S3
    url = s3_service.upload_avatar(
        file_content=content,
        original_filename=file.filename or "avatar.jpg",
        content_type=file.content_type or "image/jpeg",
    )

    if not url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al subir la imagen",
        )

    return APIResponse(
        success=True,
        message="Avatar subido exitosamente",
        data={"url": url},
    )


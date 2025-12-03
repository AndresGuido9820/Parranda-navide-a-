"""S3 Storage Service for uploading files."""

import uuid
from datetime import datetime
from typing import Optional

import boto3
from botocore.exceptions import ClientError

from app.infrastructure.config.settings import (
    settings,
    S3_RECIPES_PATH,
    S3_AVATARS_PATH,
)


class S3StorageService:
    """Service for uploading files to S3."""

    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            region_name=settings.s3_region,
        )
        self.bucket_name = settings.s3_bucket_name
        self.base_url = settings.s3_base_url

    def _generate_filename(self, original_filename: str, prefix: str = "") -> str:
        """Generate a unique filename."""
        ext = original_filename.rsplit(".", 1)[-1] if "." in original_filename else "jpg"
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        return f"{prefix}{timestamp}_{unique_id}.{ext}"

    def upload_file(
        self,
        file_content: bytes,
        original_filename: str,
        folder: str,
        content_type: str = "image/jpeg",
    ) -> Optional[str]:
        """
        Upload a file to S3.
        
        Args:
            file_content: The file content as bytes
            original_filename: Original filename for extension
            folder: S3 folder (songs, recipes, avatars)
            content_type: MIME type of the file
            
        Returns:
            The public URL of the uploaded file, or None if failed
        """
        try:
            filename = self._generate_filename(original_filename)
            key = f"{folder}/{filename}"

            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=file_content,
                ContentType=content_type,
            )

            return f"{self.base_url}/{key}"

        except ClientError as e:
            print(f"Error uploading to S3: {e}")
            return None

    def upload_recipe_image(
        self,
        file_content: bytes,
        original_filename: str,
        content_type: str = "image/jpeg",
    ) -> Optional[str]:
        """Upload a recipe image."""
        return self.upload_file(
            file_content,
            original_filename,
            S3_RECIPES_PATH,
            content_type,
        )

    def upload_avatar(
        self,
        file_content: bytes,
        original_filename: str,
        content_type: str = "image/jpeg",
    ) -> Optional[str]:
        """Upload a user avatar."""
        return self.upload_file(
            file_content,
            original_filename,
            S3_AVATARS_PATH,
            content_type,
        )

    def delete_file(self, url: str) -> bool:
        """
        Delete a file from S3 by its URL.
        
        Args:
            url: The full S3 URL of the file
            
        Returns:
            True if deleted successfully, False otherwise
        """
        try:
            # Extract key from URL
            key = url.replace(f"{self.base_url}/", "")
            
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=key,
            )
            return True

        except ClientError as e:
            print(f"Error deleting from S3: {e}")
            return False


# Singleton instance
s3_service = S3StorageService()

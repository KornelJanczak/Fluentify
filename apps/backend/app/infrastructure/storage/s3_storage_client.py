import aioboto3


class S3StorageClient:
    """Infrastructure client for S3 / Neon Object Storage operations."""

    def __init__(
        self,
        endpoint_url: str,
        aws_access_key_id: str,
        aws_secret_access_key: str,
        region_name: str,
    ) -> None:
        self._session = aioboto3.Session(
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name,
        )
        self._endpoint_url = endpoint_url

    async def put_object(
        self,
        bucket: str,
        key: str,
        body: bytes,
        content_type: str = "binary/octet-stream",
    ) -> None:
        async with self._session.client("s3", endpoint_url=self._endpoint_url) as s3:
            await s3.put_object(
                Bucket=bucket,
                Key=key,
                Body=body,
                ContentType=content_type,
            )

    async def generate_presigned_url(
        self,
        bucket: str,
        key: str,
        expires_in: int = 3600,
    ) -> str:
        async with self._session.client("s3", endpoint_url=self._endpoint_url) as s3:
            return str(
                await s3.generate_presigned_url(
                    "get_object",
                    Params={"Bucket": bucket, "Key": key},
                    ExpiresIn=expires_in,
                )
            )

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3_REGION, S3_BUCKET_ID, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "$env/static/private";

const s3Client = new S3Client({ region: S3_REGION, credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY } });

export async function createObject(key: string, data: string | Blob | Uint8Array | Buffer | undefined ) {
    const command = new PutObjectCommand({
        Bucket: S3_BUCKET_ID,
        Key: key,
        Body: data
    });
    return (await s3Client.send(command));
}

export async function getObject(key: string) {
    const command = new GetObjectCommand({
        Bucket: S3_BUCKET_ID,
        Key: key
    })
    return (await s3Client.send(command));
}

export async function deleteObject(key: string) {
    const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_ID,
        Key: key
    })
    return (await s3Client.send(command));
}
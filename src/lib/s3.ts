import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (file: File, fileName: string): Promise<string> => {
  try {
    console.log("Начало загрузки файла в S3:", {
      fileName,
      fileType: file.type,
      fileSize: file.size
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: `excursions/${fileName}`,
      Body: buffer,
      ContentType: file.type,

    });

    console.log("Отправка команды в S3:", {
      bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      key: `excursions/${fileName}`,
      contentType: file.type
    });

    await s3Client.send(command);

    const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/excursions/${fileName}`;
    console.log("Файл успешно загружен в S3:", url);

    return url;
  } catch (error) {
    console.error("Ошибка при загрузке файла в S3:", error);
    throw new Error("Не удалось загрузить файл");
  }
}; 
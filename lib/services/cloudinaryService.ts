import { randomUUID } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryCloudName } from "@/lib/utils/cloudinary";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const BOARD_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

function ensureCloudinaryConfig() {
  const cloudName = getCloudinaryCloudName();
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function uploadBoardImage(file: File): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("JPG, PNG, WEBP 이미지만 업로드할 수 있습니다.");
  }

  if (file.size > BOARD_IMAGE_MAX_BYTES) {
    throw new Error("이미지는 5MB 이하만 업로드할 수 있습니다.");
  }

  ensureCloudinaryConfig();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "soom/board",
        // 익명 게시판: 이미지 URL이 그대로 공개되므로 사용자 id 등 식별 값을 파일명에 넣지 않는다.
        public_id: randomUUID(),
        resource_type: "image",
        overwrite: false,
      },
      (error, uploadResult) => {
        if (error || !uploadResult?.secure_url) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }
        resolve({ secure_url: uploadResult.secure_url });
      },
    );

    upload.end(buffer);
  });

  return result.secure_url;
}

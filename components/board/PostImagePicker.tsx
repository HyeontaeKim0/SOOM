"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BOARD_POST_IMAGES_MAX } from "@/lib/validation/boardPost";
import { getOptimizedCloudinaryUrl } from "@/lib/utils/cloudinary";

type PostImagePickerProps = {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
};

type UploadingImage = {
  id: string;
  previewUrl: string;
};

export default function PostImagePicker({
  images,
  onChange,
  disabled = false,
}: PostImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const totalCount = images.length + uploadingImages.length;
  const canAddMore = totalCount < BOARD_POST_IMAGES_MAX && !disabled;

  const uploadFile = async (file: File): Promise<string | null> => {
    const previewUrl = URL.createObjectURL(file);
    const uploadId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setUploadingImages((prev) => [...prev, { id: uploadId, previewUrl }]);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "이미지 업로드에 실패했습니다.");
      }

      return data.url;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "이미지 업로드에 실패했습니다.";
      setUploadError(message);
      return null;
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploadingImages((prev) => prev.filter((item) => item.id !== uploadId));
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const remainingSlots = BOARD_POST_IMAGES_MAX - totalCount;
    const filesToUpload = files.slice(0, remainingSlots);
    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      const url = await uploadFile(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-[#4A4A4A]">
        이미지{" "}
        <span className="text-xs text-[#C0B8B0] font-normal">
          (최대 {BOARD_POST_IMAGES_MAX}장, JPG/PNG/WEBP, 5MB 이하)
        </span>
      </label>

      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div
            key={image}
            className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#E0D9D0] bg-[#F5F0EB]"
          >
            <Image
              src={getOptimizedCloudinaryUrl(image, { width: 200 })}
              alt={`첨부 이미지 ${index + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-sm leading-none hover:bg-black/80 transition-colors"
                aria-label="이미지 삭제"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {uploadingImages.map((item) => (
          <div
            key={item.id}
            className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#E0D9D0] bg-[#F5F0EB]"
          >
            <Image
              src={item.previewUrl}
              alt="업로드 중"
              fill
              className="object-cover opacity-60"
              sizes="96px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="text-xs font-semibold text-white">업로드 중</span>
            </div>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadingImages.length > 0}
            className="w-24 h-24 rounded-xl border border-dashed border-[#D5CEC4] bg-[#FBF7F3] text-[#8C8478] hover:border-signature hover:text-signature transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center justify-center gap-1 h-full text-xs font-semibold">
              <span className="text-2xl leading-none">+</span>
              <span>추가</span>
            </div>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadError && (
        <p className="text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  );
}
